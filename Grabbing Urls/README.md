# Download Images From Image Search Engine

Download images including urls from Google, Bing, Flickr, Instagram with given keyword

> Demo: https://www.youtube.com/watch?v=zfMBE3D9IG4

## Configuration

Copy these following information to corresponding fields in the `secret.ini` file

**1. Bing:** https://azure.microsoft.com/en-us/try/cognitive-services/my-apis/?api=bing-image-search-api

![](https://raw.githubusercontent.com/18520339/image-search-downloader/main/images/bing.png)

**2. Flickr:** https://www.flickr.com/services/apps/create/noncommercial/

![](https://raw.githubusercontent.com/18520339/image-search-downloader/main/images/flickr.png)

**3. Instagram:** https://www.instagram.com/explore/tags/?__a=1

-   Press F12 and go to Network Panel
-   Click csp_report/ in the Name column
-   Copy the string of cookie in Request Headers

![](https://raw.githubusercontent.com/18520339/image-search-downloader/main/images/instagram.png)

## Usage

**1. Google:**

-   Search your images and start scrolling to the end
-   Copy + paste the function in the `get_google_urls.js` file into the console

![](https://raw.githubusercontent.com/18520339/image-search-downloader/main/images/google.png)

**2. Bing:**

-   Example: `python get_bing_urls.py -o 'images' -k 'cat'`

```
usage: get_bing_urls.py [-h] -o OUT -k KEYWORD [-p PER] [-m MAX]

optional arguments:
  -h, --help                      show this help message and exit
  -o OUT, --out OUT               path to images directory
  -k KEYWORD, --keyword KEYWORD   search query for API
  -p PER, --per PER               number results per requests
  -m MAX, --max MAX               total results
```

**3. Flickr:**

-   Example: `python get_flickr_urls.py -o 'images' -k 'cat'`

```
usage: get_flickr_urls.py [-h] -o OUT -k KEYWORD [-p PER] [-m MAX]

optional arguments:
  -h, --help                      show this help message and exit
  -o OUT, --out OUT               path to images directory
  -k KEYWORD, --keyword KEYWORD   search query for API
  -p PER, --per PER               number results per requests
  -m MAX, --max MAX               total results
```

**4. Instagram:**

-   Example: `python get_instagram_urls.py -o 'images' -k 'cat'`

```
usage: get_instagram_urls.py [-h] -o OUT -k KEYWORD [-m MAX]

optional arguments:
  -h, --help                      show this help message and exit
  -o OUT, --out OUT               path to images directory
  -k KEYWORD, --keyword KEYWORD   search query for API
  -m MAX, --max MAX               total results
```

**5. Download images from url file:**

-   Example: `python download_images.py -o 'images' -u 'cat.txt'`

```
usage: download_images.py [-h] -o OUT -u URLS [-s START]

optional arguments:
  -h, --help                show this help message and exit
  -o OUT, --out OUT         path to images directory
  -u URLS, --urls URLS      path to image urls file
  -s START, --start START   start number of image name
```

## Many thanks to

-   https://www.pyimagesearch.com/2018/04/09/how-to-quickly-build-a-deep-learning-image-dataset/
-   https://www.pyimagesearch.com/2017/12/04/how-to-create-a-deep-learning-dataset-using-google-images/
