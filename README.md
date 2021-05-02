# Flexclub Weather App

## Deliverables

### Clean, maintainable, well-structured code
- See the comments at the top (and in the code) of each file for more details
- The app is split into separate components for each element (see /src/components)
- The 2 files where most of the work/processing happens:
    - weatherAppEvents handles events and fetches data (see /src/mixins)
    - Data store that holds/formats/returns required data (see /store/index.js)

### Best practices
- Best practices followed as much as I am aware (This is very open ended with JavaScript)
- Setup the linting rules that I like to work with in .eslintrc.js
    - I prefer certain things, which I find more readable/usable
    - I run linting with auto fix when a file is saved
- I am not using prettier
    - For me, unfortunately, certain of its rules makes code much harder to read, use and uglier
    

### Idempotence and resiliency
- Data is saved/restored when app closes
- Data only fetched when required
- Events processed only when data changes

### Good UX & design
- Responsive 
- I think it is well-designed and clear

### Attention to detail
- I have covered all the details I can see 

### How to get the environment up and running and any other notes to make testing easier.
- Online demo: https://flexclubweather.webengineer.co.za/
- Download or clone the repo
- Install packages
        
        npm install

- Testing/Development to run on local HMR server
  
        npm run serve

- Build production code

        npm run build

    - This will create code in the /dist directory
    - You can run /dist/index.html from the root of a web server
    

- Run the following, to open /dist/index.html to run the app without a server (without custom icons) 

        
        node make_local.js


### Any thoughts on what you would have done differently if you had more time / in retrospect / were to spend more time optimising.
- My first approach was to fetch the API data in the Vuex store
    - Found out that Vuex does not seem to play nice with Promises and does not wait for them to resolve
    - Moved the fetching of the data into its own component/mixin
- Improve the icons
    - Find better icons to use 
    - Create a function to look for keywords, instead of all the permutations of weather descriptions 
- Add some unit tests 
- Put some variables in an env file
    - Have not worried about security with the API key as it is visible in the API call
- Was trying to create a mobile app to see how much of shared code I code use

### Any suggestions to improve the project and brief.
- Ambiguous/open ended parts
    - Icons
        - Are the night icons shown if it is night in the city or where the user is? 
        - Which Climaicons or which feed icons do you want to see in what conditions? (See my IconWeather component for my implementation)
    - Temperature
        - What do you want to use as the main temperature?
            - Maximum temperature for the day? Average temperature of the day? Specific time?
            - Can this be obtained from the forecast feed? Or the weather feed? 
            - The data in the weather feed is pretty much the same as the forecast feed and not needed. But, from the coding point of view it is good to see how one syncs and uses both feeds  
        - I have added minimum and maximum temperature, it is useful information for the user to see and good to see how this is implemented from the coding point of view
    - Chart
        - What times do you want to see in the x-axis?
        - The users timezone? Time in the selected city?
        - Any specific range or requirements you would like for the y-axis?
    - 5 days
        - What do you want to happen when the timezone from the city changes the days?
            - Keep the selected block active?
            - Keep the active day on the date?
            - And when the date is not in the 5 days anymore?
    - Midnight
        - What would you like to happen if the app is open at midnight?
- Clock
    - Add the clock to show the current time and noon in the selected city
        - Useful for the user of the app
        - Useful in developing the app
        - Useful to see how this is implemented
- Cities
    - Make it easy to add new cities into the app

### Other aspects
- Had implemented the background animations with only CSS (no JavaScript Intervals), however CSS animations use RGB color space and not HSB
- I did not want to use other libraries frameworks, but dates and color conversions were getting messy with my own implementations 
    - Used dayjs to manage date/times
    - Used color-convert to manage converting colors between color spaces 
    


