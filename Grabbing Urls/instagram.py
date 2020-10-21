from configparser import ConfigParser
from argparse import ArgumentParser
import requests
import os

ap = ArgumentParser()
ap.add_argument('-o', '--out', required=True, help='path to images directory')
ap.add_argument('-k', '--keyword', required=True, help='search query for API')
ap.add_argument('-m', '--max', default=1000, help='total results')
args = vars(ap.parse_args())

config = ConfigParser(interpolation=None)
config.read('secret.ini')
keyword = args['keyword']

ENDPOINT = f"https://www.instagram.com/explore/tags/{keyword.replace(' ', '')}/"
COOKIE = config['INSTAGRAM']['COOKIE']

urls_file = os.path.join(args['out'], f'{keyword}.txt')
headers = {'cookie': COOKIE}
params = {
    '__a': 1,
    'max_id': ''
}

print('[INFO] Searching Instagram API for', keyword)
results = requests.get(ENDPOINT, headers=headers, params=params).json()
results = results['graphql']['hashtag']['edge_hashtag_to_media']
page_info = results['page_info']

total_results = min(results['count'], int(args['max']))
print('[INFO] Found', total_results, 'total results for', keyword)

with open(urls_file, 'w') as f:
    while total_results > 0:
        print('[GET] Request urls for cursor', page_info['end_cursor'])
        results = requests.get(ENDPOINT, headers=headers, params=params).json()
        results = results['graphql']['hashtag']['edge_hashtag_to_media']
        page_info = results['page_info']

        params['max_id'] = page_info['end_cursor']
        total_results -= len(results['edges'])

        for value in results['edges']:
            f.write("%s\n" % value['node']['display_url'])

    print(f'[INFO] Saving all request urls to {urls_file}')
    f.close()
