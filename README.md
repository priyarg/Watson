


#Frontend features/tasks
Allow a user to enter a text that can be analysed using the custom Watson integration and displays the results of the identified category along with other details you can choose in a tabular form.
Handle any obvious errors.

#Working of app
User submits username(sam/gaurav/karthikeya) on login screen and gets access to login screen.
When user enters sample question (url or plain text), Watson API processes the request and displays appropriate categories and score in percentage.
The server endpoint needs two inputs: username(sam/gaurav/karthikeya) and question. Question entered can be in any format like text or URL. Entered question is checked for text or URL using regex. Following front end validations are checked:
If sample question field is empty
If there exists a network error
If invalid sample question
A POST request with content type as application/json is made to custom microservice  (Watson Natural Language Understanding API) written in Node -JS-Express.
Output obtained from backend (JSON response) is parsed to show category and score in %.



#Clone Repository and Running on device/emulator

-- git clone https://github.com/priyarg/Watson.git
-- cd Watson
-- npm install (to install project dependencies)
-- open expoXde,click on open existing project and search watson
-- start React Native packager and open on Device connected


#Expo link : https://exp.host/@priyarg/imadapprna

