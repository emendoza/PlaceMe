# PlaceMe
Location Finder App
github: https://github.com/emendoza/PlaceMe.git
Tested on Google Chrome and Internet Explorer 11

This application allows users to search for specified locations.

Instructions:

Please run the following:

  'npm install'

  'npm start'
  
This will start the app on port 8080

NOTE: make sure 8080 is not currently being used!

Search

  1. Enter point of interest in the designated input area.
  
  2. (Optional) Show Advanced Options:
  
    a. Here users can add a reference point in the form of an addres, city etc.
    This will be the location where the search will center around.
    
    b. Ideal Miles from reference point refers to a radius within which the search will bias locations. Locations found within the radius will be ranked higher.
    	NOTE: locations outside of the radius will still be discovered.
    
  3. Pressing on the "PlaceMe" button or clicking the enter key will run the search and take users to the results page.
  
Results

  1. This page has the results from the latest search, including the name, icon, address, and tags.
  
  2. Clicking on the name will bring the user to the corresponding Google Maps link in a new tab.
