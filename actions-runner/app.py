from http.server import BaseHTTPRequestHandler, HTTPServer

class MyHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

        response = """
        <html>
            <head>
                <title>DevOps Learning App</title>
            </head>
            <body>
                <h1>Hello from GitHub Self-Hosted Runner!</h1>
                <p>Application is running successfully.</p>
            </body>
        </html>
        """

        self.wfile.write(response.encode())

server = HTTPServer(("0.0.0.0", 8080), MyHandler)

print("Application started on port 8080")

server.serve_forever()
