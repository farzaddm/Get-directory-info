# Get Folder Info
This project allows you to see what is in your server without connecting to it from the terminal or anywhere else. It has the capability to upload and download files and features both dark and light themes.

## Built With
* nodejs
* ejs
* css
* sqlite


## Getting Started
Follow these steps to set up the project locally:

### Prerequisites

Ensure you have Node.js and npm installed on your system.

### Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/farzaddm/Get-directory-info.git
   ```
2. **Install NPM packages:**
    ```sh
    npm install
    ```
3. **Add user credentials:**
   Add your username, password, and role (admin/user) in `database/database.db`. Note that only admins can upload files to the server.
4. **Run the project:**
   ```sh
    node app.js
   ```

## Usage
To run the application on your server and keep it active indefinitely, consider using `tmux`. Access the application anytime by navigating to `http://serverIp:3026`.

## Features
- Upload and download files.
- Toggle between dark and light themes.
- Two types of user accessibility: admin and user.

## App Structure

```bash
myandpp
|__controller                               # contains controller files
|       |__controller.js                    # process path request
|       |__authController.js                # login and logout functions
|__database                                 # contains database files
|       |__database.js                      # sqlite file and querys
|       |__database.db                      # my tables
|__doc
|__middleware                               
|       |__authMiddleware.js                # middleware for checking authentications
|__public
|    |__d_bg.jpg                            # background for dark theme
|    |__l_bg.jpg                            # background for light theme
|    |__style.css
|__test
|__uploads                                  # uploaded files will be in it
|__views                                    # all ejs files
|    |__partilas
|    |      |__header.ejs
|    |__file.ejs                            # content of files will be shown on it
|    |__home.ejs                            # home page
|    |__login.ejs                           # login page
|__app.js                                   # express server
|__README.md 
|__package-lock.json
|__package.json                                 
```

## Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request.

### Note

Currently, the application uploads files to a specific folder named `uploads` in the root directory.