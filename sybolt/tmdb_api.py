
from urllib.request import urlopen
import json
import time

API_URI = 'http://api.themoviedb.org/3/movie'

def get_movie(api_key, id):
    response = urlopen('{uri}/{id}?api_key={key}'.format(
        uri=API_URI,
        id=id,
        key=api_key
    ))

    data = response.readall().decode('utf-8')
    return json.loads(data)

def get_videos(api_key, id):
    response = urlopen('{uri}/{id}/videos?api_key={key}'.format(
        uri=API_URI,
        id=id,
        key=api_key
    ))

    data = response.readall().decode('utf-8')
    return json.loads(data)

def cache_movie(api_key, cache_path, id):

    details = get_movie(api_key, id)
    videos = get_videos(api_key, id)

    # If we don't have a poster or backdrop, set a default
    if not details['backdrop_path']:
        details['backdrop_path'] = '/img/movie-backdrop.png'

    if not details['poster_path']:
        details['poster_path'] = '/img/movie-poster.png'

    # Cache our TMDB response
    cache_filename = '{}/{}.json'.format(cache_path, id)
    cache_json = dict(
        details=details,
        videos=videos['results']
    )

    with open(cache_filename, 'w') as f:
        f.write(json.dumps(
            cache_json, 
            sort_keys=True, 
            indent=4
        ))

    return cache_json

if __name__ == '__main__':
    
    movies = [
        6795, 87436, 9360, 19898, 70338, 9423, 120852, 
        10999, 110415, 132313, 73, 68718, 8329, 81188, 
        238636, 285, 137106, 15789, 10822, 120467, 8337, 
        13258, 193726, 177572, 38541, 49049, 246403, 647, 
        128, 8848, 106646, 83190, 37707, 33273, 13170, 
        228165, 14337, 9823, 49010, 112090, 578, 221732, 
        174772, 137113, 1089, 11551, 11688
    ]

    for id in movies:
        print('Caching {}'.format(id))
        cache_movie('.', id)
        time.sleep(1)
