# BookTrack

## About

BookTrack is an application that allows users to create, read, update, and delete entries from the database. Users can add/edit books using the following parameters:
- Title
- Author
- Publication date
- Description
- Price

## User Access

User access is divided into public visitors and logged-in users.

**Public User:**
- View website pages
- View book list with no CRUD capabilities

**Logged-In User:**
- View website pages
- Register/login
- View book list with CRUD capabilities
    - Add new books
    - Edit existing books
    - Delete existing books

## Languages Used

Built using:
- JavaScript
- HTML
- CSS (custom)
- EJS (templating)

## External Code

- Lectures
- CRUD & Authentication.zip file from Canvas
- Bootstrap
- Font Awesome
- Passport.js

## .env

The `.env` file is not committed to this repository as it contains the MongoDB connection string. Used `.gitignore` to prevent it from being committed.