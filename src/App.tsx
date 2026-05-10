import { useState, useEffect } from 'react';
import './App.css';
import { generate } from 'random-words';
import HangmanDrawing from './Components/HangmanDrawing/HangmanDrawing';
import HangmanWord from './Components/HangmanWord/HangmanWord';
import Keyboard from './Components/Keyboard/Keyboard';
import useDarkMode from './hooks/useDarkMode';

function App() {
  const [wordToGuess] = useState(generate({ minLength: 4 }));
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [isLoser, setIsLoser] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [setTheme, , theme] = useDarkMode();

  const [currentTheme, setcurrentTheme] = useState(theme)

  const incorrectGuesses = guessedLetters.filter(item => !wordToGuess.includes(item));


  useEffect(() => {
    if (incorrectGuesses.length >= 6 && !isLoser) {
      setIsLoser(true);
    }

    if (wordToGuess
      .toString()
      .split("")
      .every(letter => guessedLetters.includes(letter)) && !isWinner) {
      setIsWinner(true);
    }
  }, [guessedLetters, incorrectGuesses, wordToGuess, isLoser, isWinner]);

  const addGuessedLetter = (letter: string) => {
    if (guessedLetters.includes(letter) || isWinner || isLoser) return;
    setGuessedLetters(currentLetters => [...currentLetters, letter]);
  };

  const handleThemeChange = () => {
    setTheme(currentTheme => (currentTheme === "light" ? "dark" : "light"));
    setcurrentTheme(currentTheme => (currentTheme === "light" ? "dark" : "light"));
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (!key.match(/[a-z]/i)) return;
      e.preventDefault();
      addGuessedLetter(key);
    };

    document.addEventListener('keypress', handler);
    return () => document.removeEventListener('keypress', handler);
  }, [guessedLetters]);

  return (
    <div className={`main flex flex-col gap-8 items-center justify-center m-auto max-w-[800px] h-auto w-screen ${theme === 'dark' ? 'dark:bg-gray-800' : 'bg-white'} md:overflow-hidden`}>
<div className="header flex flex-col items-center justify-center relative w-screen gap-4 py-4">        <h1
          className={`message text-2xl font-semibold text-center cursor-pointer px-5 py-2 rounded-full outline-1 outline-gray-500 hover:outline ${isWinner ? "text-green-600" : "text-red-600"}`}
          onClick={() => window.location.reload()}
        >
          {isLoser && (
            <span>
              Correct word was{" "}
              <span className='text-black font-bold font-mono dark:text-white'>
                {wordToGuess}
              </span>
              . Click to Try Again. 😞
            </span>
          )}
          {isWinner && "You Won 👏 Click to Play again"}
        </h1>

        <button
          onClick={handleThemeChange}
className='bg-transparent border border-black px-2 py-2 rounded-full hover:text-white hover:bg-[#5e17eb] dark:border-[#5e17eb]'>
            Change Theme
        </button>
      </div>

      <div className='md:flex md:flex-row flex-col m-auto'>
        <HangmanDrawing 
          nog={incorrectGuesses.length} 
          isWinner={isWinner} 
          theme={currentTheme} // Pass the theme to HangmanDrawing component
        />
        <HangmanWord 
          guessedLetters={guessedLetters} 
          wordToGuess={wordToGuess.toString()} 
        />
      </div>
      <Keyboard
        activeLetter={guessedLetters.filter(letter => wordToGuess.includes(letter))}
        inactiveLetter={incorrectGuesses}
        addGuessedLetter={addGuessedLetter}
        isWinner={isWinner}
        isLoser={isLoser}
      />
    </div>
  );
}

export default App;
