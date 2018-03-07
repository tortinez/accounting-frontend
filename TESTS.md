## MCIA Accounting System Tests

### General

* [x] Verify permissions of the different users
* [ ] Working on chrome and firefox
* [ ] Layout [#9](#b9) [#10](#b10)

### Login Page

* [x] Wrong Username or password warning
* [x] User disabled warning
* [x] Login
* [x] All buttons & sidenav diabled

### Main Page (Purchases Table)

* [ ] Filters Usage [#1](#b1) [#2](#b2) [#3](#b3)
* [x] Cancel Filtering
* [x] Change page and number of elements shown
* [x] Save state when leaving page
* [x] Account info button working (& change password within the view)
* [x] Logout working
* [x] Edit purchase working
* [x] Add purchase working
* [x] Sidenav working
* [x] Home button working

### Edit Purchase Page

* [ ] Code field validation [#4](#b4)
* [x] Form validation working (excludind code field)
* [ ] All fields working [#5](#b5)
* [x] Edit purchase working
* [x] Add new purchase working
* [ ] Add new invoice [#12](#b7)
* [ ] Download invoice [#6](#b6)
* [ ] Delete invoice [#7](#b7)
* [x] Overwrite invoice
* [x] Error messages enabled
* [x] Delete purchase working
* [x] Cancel button working

### Purchase type page

* [x] Edit item
* [x] Add item
* [x] Delete item
* [x] Form validation

### Purchase status page

* [x] Edit item
* [x] Add item
* [x] Delete item
* [x] Form validation
* [x] Color picker

### Project page

* [x] Edit item
* [x] Add item
* [x] Delete item
* [x] Form validation

### Project type page

* [x] Edit item
* [x] Add item
* [x] Delete item
* [x] Form validation

### Client page

* [x] Edit item
* [x] Add item
* [x] Delete item
* [ ] Form validation [#8](#b8)

### Client type page

* [x] Edit item
* [x] Add item
* [x] Delete item
* [x] Form validation

### Staff page

* [x] Edit item
* [x] Add item
* [x] Delete item
* [x] Form validation

### Suppliers page

* [x] Edit item
* [x] Add item
* [x] Delete item
* [x] Form validation

### Users page

* [x] Edit item
* [x] Add item
* [x] Delete item
* [x] Form validation
* [x] Change password
* [ ] Password validation [#11](#b11)

## Issues

_(~~Striked~~ when corrected)_

~~`#1` Amount badge not working unless one both fields are used<a name='b1'></a>~~
~~`#2` Project filtering not working (it search using a custom field not existing at the backend)<a name='b2'></a>~~
~~`#3` Input fields trigger requests on each char<a name='b3'></a>~~
~~`#4` Code field validation not working<a name='b4'></a>~~
~~`#5` Code field cannot be modified<a name='b5'></a>~~
~~`#6` Gives error, uri not well constructed<a name='b6'></a>~~
~~`#7` Not available for any kind of user<a name='b7'></a>~~
~~`#8` Change acronym error message (too long)<a name='b8'></a>~~
~~`#9` Problems with the scrollbar<a name='b9'></a>~~
~~`#10` No favicon<a name='b10'></a>~~
~~`#11` Shows message but submit still works<a name='b11'></a>~~
~~`#12` Doesn't throw an error if the file is bigger than the limit<a name='b12'></a>~~

## Suggestions

_(~~Striked~~ when implemented)_

~~`#1` Login page centered~~
~~`#2` Sidenav autoclosing when pressing a link~~
~~`#3` Change purchase-form layout (1st line Concept(66%)+Code(33%))~~
