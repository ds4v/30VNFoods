from oauth2client.service_account import ServiceAccountCredentials
import gspread

import matplotlib.pyplot as plt
import argparse
import requests
import os

ap = argparse.ArgumentParser()
ap.add_argument('-s', '--spreadsheet', required=True, help='spreadsheet name')
ap.add_argument('-w', '--worksheet', required=True, help='worksheet name')
ap.add_argument('-a', '--auth', required=True, help='credentials file')
ap.add_argument('-o', '--out', required=True, help='path to images directory')
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
spreadsheet = client.open(args['spreadsheet'])
sheet = spreadsheet.worksheet(args['worksheet'])
records = sheet.get('B2:C')

length_before = len(records)
index = 0

print(f"[INFO] Found {length_before} urls in sheet {args['worksheet']}")
while index < len(records):
    url, source = records[index]
    try:
        image_name = f'{index + 1}.jpg'
        print('[GET] Downloading', image_name, '-', url)
        result = requests.get(url, timeout=60)

        image_path = os.path.join(args['out'], image_name)
        with open(image_path, 'wb') as f:
            f.write(result.content)
            f.close()

        try:
            plt.imread(image_path)
            index += 1
        except:
            print('[DELETE] Image has no contents -', image_name)
            os.remove(image_path)
            del records[index]
    except Exception as error:
        print('[ERROR]', error)
        print('[DELETE] Failed to request -', image_name)
        del records[index]

print(f"[INFO] Finish downloading {len(records)} valid images")
spreadsheet.values_clear(f"{args['worksheet']}!B2:C")
sheet.update('B2:C', records)
