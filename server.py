from http.server import SimpleHTTPRequestHandler, HTTPServer
import os


def main():

    server = None

    try:
        port = int(os.environ.get('PORT', 17995))
        handler = SimpleHTTPRequestHandler
        server = HTTPServer(('', port), handler)

        print("Web server running on port {}".format(port))

        server.serve_forever()

    except KeyboardInterrupt:
        print("\n^C entered, stopping web server...")
        server.socket.close()

if __name__ == '__main__':
    main()
