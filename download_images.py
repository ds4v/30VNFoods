import matplotlib.pyplot as plt
import argparse
import requests
import os

ap = argparse.ArgumentParser()
ap.add_argument('-o', '--out', required=True, help='path to images directory')
ap.add_argument('-u', '--urls', required=True, help='path to image urls file')
ap.add_argument('-s', '--start', default=1, help='start number of image name')
args = vars(ap.parse_args())

urls = open(args['urls']).read().strip().split('\n')
start_index = args['start']
image_names = []
i = 0

while i < len(urls):
    try:
        image_name = f'image {start_index}.jpg'
        print('[GET] Downloading', image_name, '-', urls[i])
        result = requests.get(urls[i], timeout=60)

        image_path = os.path.join(args['out'], image_name)
        with open(image_path, 'wb') as f:
            f.write(result.content)
            f.close()

        try:
            plt.imread(image_path)
            image_names.append(image_name)
            start_index += 1
            i += 1
        except:
            print('[DELETE] Image has no contents -', image_name)
            os.remove(image_path)
            urls.remove(urls[i])
    except:
        print('[ERROR] Failed to request -', image_name, '-', urls[i])
        urls.remove(urls[i])

with open(args['urls'], 'w') as f:
    for url in urls:
        f.write('%s\n' % url)
    f.close()
