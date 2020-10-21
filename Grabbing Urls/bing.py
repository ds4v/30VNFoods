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
group_size = args['per']

ENDPOINT = 'https://api.cognitive.microsoft.com/bing/v7.0/images/search'
API_KEY = config['BING']['API_KEY']

urls_file = os.path.join(args['out'], f'{keyword}.txt')
headers = {'Ocp-Apim-Subscription-Key': API_KEY}
params = {
    'q': keyword,
    'offset': 0,
    'count': group_size,
    'imageType': 'photo',
    'license': 'all'
}

print('[INFO] Searching Bing API for', keyword)
results = requests.get(ENDPOINT, headers=headers, params=params).json()

total_results = min(results['totalEstimatedMatches'], int(args['max']))
print('[INFO] Found', total_results, 'total results for', keyword)

with open(urls_file, 'w') as f:
    for offset in range(0, total_results, group_size):
        params['offset'] = offset
        print(f'[GET] Request urls for group {offset}-{offset + group_size}')
        results = requests.get(ENDPOINT, headers=headers, params=params).json()

        for value in results['value']:
            f.write("%s\n" % value['contentUrl'])

    print(f'[INFO] Saving all request urls to {urls_file}')
    f.close()
