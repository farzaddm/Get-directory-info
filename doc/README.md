# Get System Info

I use MCV model to write my website. Site have avebilty to download, upload file, dark & ligth them.

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
|   |__README.md                            # documents
|__middleware                               
|       |__authMiddleware.js                # middleware for checking authentications
|__public
|    |__bg.jpg                              # background for dark them
|    |__style.css
|__uploads                                  # uploaded files will be in it
|__views                                    # all ejs files
|    |__partilas
|    |      |__header.ejs
|    |__file.ejs                            # content of files will be shown on it
|    |__home.ejs                            # home page
|    |__login.ejs                           # login page
|__app.js                                   # express server
```

