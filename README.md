# IMAGE_API

To Run:
-> Fork the repository first on your own github account.
In Terminal:

1. Create an empty directory (mkdir dir_name)
2. cd into that directory and initialize empty repository (git init)
3. add the origin using (git remote add origin repository_url)
4. pull the repository into your local repository using git pull command.

In IDE (VS code for example):

1. Open the same directory and cd into it using the VS code terminal.
2. Run the following commands (assuming node is installed already):
npm init -y
npm install express sharp axios
this installs dependencies required for the code to run
3. go to the index.js file and in the terminal run the file using the command: node index.js
4. The server runs on port 3000 localhost

To make API Requests to the server install Postman or any other tool.

In Postman:

1. As a "Get" Request enter the url in the following format:
2. http://localhost:3000/?url=https:example.com/image.png&width=value&height=value&crop=bool&bw=bool&format=(any valid image format)&rotate=value&filter=<(sepia or blur or sharpen)&watermark=https://site.com/watermark.png
3. For your reference you can use this url: http://localhost:3000/?url=https://static.wikia.nocookie.net/spidermanps4/images/d/d4/Marvel%27s_Spider-Man_front_cover_%28US%29.png&width=500&height=500&crop=true&bw=false&format=jpg&rotate=0&filter=sharpen&watermark=https://clipart-library.com/images/dT45GppGc.png
4. After hitting send, In the body section of Postman you will see the image as per the parameters specified as well as list of parameters under params section of postman where you can change the parameters as well.

Note: Read the comments written with the code to understand the code better.
