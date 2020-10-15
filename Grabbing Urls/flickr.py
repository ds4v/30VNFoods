from configparser import ConfigParser
from argparse import ArgumentParser
import requests
import os

ap = ArgumentParser()
ap.add_argument('-o', '--out', required=True, help='path to images directory')
ap.add_argument('-k', '--keyword', required=True, help='search query for API')
ap.add_argument('-p', '--per', default=100, help='number results per requests')
ap.add_argument('-m', '--max', default=1000, help='total results')
args = vars(ap.parse_args())

config = ConfigParser()
config.read('secret.ini')
keyword = args['keyword']
group_size = min(args['per'], 500)

ENDPOINT = 'https://www.flickr.com/services/rest/'
METHOD = 'flickr.photos.search'
API_KEY = config['FLICKR']['API_KEY']

urls_file = os.path.join(args['out'], f'{keyword}.txt')
params = {
    'method': METHOD,
    'api_key': API_KEY,
    'text': keyword.replace(' ', ''),
    'per_page': group_size,
    'page': 1,
    'format': 'json',
    'nojsoncallback': 1
}

print('[INFO] Searching Flickr API for', keyword)
results = requests.get(ENDPOINT, params=params).json()

total_results = min(int(results['photos']['total']), int(args['max']))
print('[INFO] Found', total_results, 'total results for', keyword)

with open(urls_file, 'w') as f:
    for page in range(max(1, total_results // group_size)):
        params['page'] = page + 1
        print('[GET] Request urls for page', page + 1)
        results = requests.get(ENDPOINT, params=params).json()

        for value in results['photos']['photo']:
            id, secret, server = value['id'], value['secret'], value['server']
            image_url = f'https://live.staticflickr.com/{server}/{id}_{secret}_b.jpg'
            f.write("%s\n" % image_url)

    print(f'[INFO] Saving all request urls to {urls_file}')
    f.close()
