from oauth2client.service_account import ServiceAccountCredentials
import gspread

from io import BytesIO
from PIL import Image
import imagehash

import argparse
import requests
import os

ap = argparse.ArgumentParser()
ap.add_argument('-s', '--spreadsheet', required=True, help='spreadsheet name')
ap.add_argument('-w', '--worksheet', required=True, help='worksheet name')
ap.add_argument('-a', '--auth', required=True, help='credentials file')
ap.add_argument('-d', '--diff', default=20, help='different points')
args = vars(ap.parse_args())

credentials = ServiceAccountCredentials.from_json_keyfile_name(
    args['auth'],
    [
        'https://spreadsheets.google.com/feeds',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive'
    ]
)

client = gspread.authorize(credentials)
sheet = client.open(args['spreadsheet']).worksheet(args['worksheet'])
records = sheet.get('B2:C')

image_hashes = []
index = 0
idx0 = 0

print(f"[INFO] Found {len(records)} urls in sheet {args['worksheet']}")
while index < len(records):
    url, source = records[index]
    try:
        response = requests.get(url)
        print(f'[INFO] Caculate hashes of image {index + 1} from {url}')

        image = Image.open(BytesIO(response.content))
        ahash = imagehash.average_hash(image)
        phash = imagehash.phash(image)
        dhash = imagehash.dhash(image)

        image_hashes.append((ahash, phash, dhash))
        index += 1
    except:
        print('[ERROR] Failed to request', url)
        records.remove(records[index])

print(f'[INFO] Begin sorting urls by similarity of image content')
while idx0 < len(records):
    url0 = records[idx0][0]
    print(f'[CHECKING] url {idx0 + 1}: {url0}')

    ahash0, phash0, dhash0 = image_hashes[idx0]
    if not (ahash0 and phash0 and dhash0): continue

    insert_count = 0
    for idx1 in range(idx0 + 1, len(records)):
        url1 = records[idx1][0]

        ahash1, phash1, dhash1 = image_hashes[idx1]
        if not (ahash1 and phash1 and dhash1): continue

        distances = [ahash0 - ahash1, phash0 - phash1, dhash0 - dhash1]
        diff_results = sum(dist < args['diff'] for dist in distances)

        if diff_results >= 2:
            print(f'|--Similar with url {idx1 + 1}: {url1}')
            insert_count += 1

            image_hashes.insert(idx0 + 1, image_hashes[idx1])
            records.insert(idx0 + 1, records[idx1])
            del image_hashes[idx1 + 1]
            del records[idx1 + 1]
    idx0 += insert_count + 1

print(f'[UPDATE] Finish sorting and write to sheet')
sheet.update('B2:C', records)
