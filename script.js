//CSS element selectors 
const typingTextBox = document.querySelector(".typing-text-box p");
const inputField = document.querySelector(".wrapper .input-field");
const mistakeTag = document.querySelector(".mistakes span");
const timeTag = document.querySelector(".time span b");
const wpmTag = document.querySelector(".wpm span");
const accuracyTag = document.querySelector(".accuracy span b");
const tryAgainBtn = document.querySelector(".result-box button");


//To store variables
let characterIndex = mistakes = typedChars = correctTypos = 0,
timer, maxTime = 60, timeLeft = maxTime, start = false;

//Function to load paragraphs
function randomParagraphGenerate(){

	//1. Generating random numbers <15 to access them from the array
	let randomIndex = Math.floor(Math.random() * paragraphs.length);
	typingTextBox.innerHTML = "";

	//2. Splitting each and every alphabet to a span tag
	//So that we can access each alphabet individually
	paragraphs[randomIndex].split("").forEach(span => {
		let spanTag = `<span>${span}</span>`;
		typingTextBox.innerHTML += spanTag;
	});

	//3. To modify the state of the first letter as active
	typingTextBox.querySelectorAll("span")[0].classList.add("active");

	//4. Input field is focused on pressing any key / clicking on text
	document.addEventListener("keydown", () => inputField.focus());
	typingTextBox.addEventListener("click", () => inputField.focus());
}

//Function which invokes when the user inputs / uses the keyboard
function realTimeTyping(){

	//Selector for all the paragraph alphabet spans
	const characters = typingTextBox.querySelectorAll("span");
	//Variable for each alphabet (typed as words) by user
	let typedCharacter = inputField.value.split("")[characterIndex];

	//User can type only within the time limit
	if(characterIndex < characters.length-1 && timeLeft>0){

		//For time, which is invoked only for the first key pressed by user
		//Once timer has started, the clock won't restart again
		if(!start){
			timer = setInterval(clock, 1000);
			start = true;
		}

		//When user presses backspace
		if(typedCharacter == null){
			//Decrements characterIndex and typedChars
			characterIndex--;
			typedChars--;

			//Decrements mistakes for incorrect & correctTypos for correct chars
			if(characters[characterIndex].classList.contains("incorrect"))
				mistakes--;
			else
				correctTypos--;

			//Removes correct or incorrect status from the spans
			characters[characterIndex].classList.remove("correct","incorrect");
		}

		//When user types anything
		else{
			typedChars++;

			//Correct character is typed
			if(characters[characterIndex].innerText === typedCharacter){
				correctTypos++;
				characters[characterIndex].classList.add("correct");
			}
			//Incorrect character is typed
			else{
				mistakes++;
				characters[characterIndex].classList.add("incorrect");		
			}

			characterIndex++;
		}

		//Removes active status from the latest typed character
		characters.forEach(span => span.classList.remove("active"));
		//Adds active status to the next current character
		characters[characterIndex].classList.add("active");

		//Assuming a word contains 5 alphabets in WPM calculation
		let wpm = (((characterIndex - mistakes)/5) / (maxTime - timeLeft)) * 60;
		wpm = Math.round(wpm);
		wpm = (wpm<0 || !wpm || wpm === Infinity) ? 0 : wpm;
		
		//Accuracy calculation
		let accuracy = Math.round((correctTypos / typedChars) * 100);

		wpmTag.innerText = wpm;
		mistakeTag.innerText = mistakes;
		accuracyTag.innerText = accuracy;
	}
	//User cannot type when timeLeft <= 0
	else{
		inputField.value = "";
		clearInterval(timer);
	}
}

//This function is called after each second by setInterval
function clock(){
	if(timeLeft > 0){
		timeLeft--; //Decrements time by 1sec 
		timeTag.innerText = timeLeft;
	}
	else
		clearInterval(timer); //Stops timer when timeLeft = 0
}

//Resets all the parameters when tryAgainBtn is pressed
function reset(){
	randomParagraphGenerate();
	clearInterval(timer);
	inputField.value = "";
	characterIndex = mistakes = typedChars = correctTypos = 0;
	start = false;
	timeLeft = maxTime;
	timeTag.innerText = maxTime;
	wpmTag.innerText = 0;
	mistakeTag.innerText = mistakes;
	accuracyTag.innerText = 100;
}

//To invoke the function and load a random paragraph
randomParagraphGenerate();

//To invoke the function when user types anything (callback)
inputField.addEventListener("input", realTimeTyping);

//To invoke the function when user presses tryAgainBtn (callback)
tryAgainBtn.addEventListener("click", reset);

/* Soham Banik */