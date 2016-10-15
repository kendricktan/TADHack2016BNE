import requests

new_url = raw_input('Enter your new URL: ')

r = requests.put(
    'https://api.ciscospark.com/v1/webhooks/Y2lzY29zcGFyazovL3VzL1dFQkhPT0svYWNhMDIzZDUtMjI3OC00MmVlLTg3MjQtY2Y3NmQ3MTMyNTY4',
    json={
        'targetUrl': new_url
    },
    headers={
        'Authorization': 'Bearer MjI0NWIzYzgtODI1ZC00M2Y1LTg1ODctNmM4NDFkMTM1YTIxMmYxZDQ1NzItMTUx',
        'Content-Type': 'application/json'
    }
)

print(r)
