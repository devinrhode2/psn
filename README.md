# PHP style node, psn

Same thing as PHP except you get to use javascript code in place of php code. Code delimiters are `<%` and `%>`

## Example

    <p>Here's some html. <%= 'Heres some dynamic output'+user.name %> </p>

## Install/Setup/Usage/slash

* 1: Create new folder and put an empty server.js file in it
* 3: Put `require('psn')` in the file.
* 4: Open the Terminal or Command Prompt at this directory and run:

    npm install devinrhode2/psn
    
    //This will fail if you don't have node 0.8.13 stable...
    //which is so bleeding edge it isn't even available at the time of this writing, so do:
    npm install git://github.com/devinrhode2/psn
    
    //The above install feature is in the latest npm and I think it'll be released in node 0.8.13
    //I'd rather not have to update the npm registry with every update.

* 5: Create a site. Use .ejs files instead of .php. Good luck with databases or doing anything really interesting. I'm sarcastically serious.

* 2: undefined

## Contributing

Anyone and everyone is welcome to contribute. [Please follow the guidelines.](/devinrhode/psn/blob/master/CONTRIBUTING.md)

## Haters

Should refer to psn as __Not PhotoShop__ the carry on the acronym mis-ordering of php, __hypertext pre-processor__, this will assure it doesn't become widely known. The meanest way to hate is silently, so this is a compromise to simply aschew and confuse others about the meaning of the acronym `psn`

## Trolling

Issues tab is a fun place for this. However, Hardcore trolling(R) takes in the pull requests tab. Ideally the psn(R) project prefers really useful but sneakily shitty code that will bite people in the ass later. Failing silently, mis-naming functions, and leaking memory are all favorable things with psn. Code that fails to do this will probably not be accepted.

# TAKE ME SRSLY, FOLLOW @DEVINRHODE2