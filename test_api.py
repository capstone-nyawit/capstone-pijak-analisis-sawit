import urllib.request
import urllib.error

url_exec = 'http://localhost:8000/api/admin/reports/executive'
url_zone = 'http://localhost:8000/api/admin/reports/zone-comparison'

def test(url):
    req = urllib.request.Request(url, headers={'Authorization': 'Bearer 123'})
    try:
        resp = urllib.request.urlopen(req)
        print(url, resp.status)
    except urllib.error.HTTPError as e:
        print(url, e.code)
        print(e.read().decode('utf-8'))

test(url_exec)
test(url_zone)
