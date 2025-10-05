//Dialog Box Functionality
const dialog = document.getElementById('modal') ;
const openBtn = document.getElementById('open-btn') ;
const closeBtn = document.getElementById('close-btn') ;

const textArea = document.querySelector(".text-area");
const characterCounter = document.querySelector(".character-counter");

if((dialog instanceof HTMLDialogElement) && (openBtn instanceof HTMLButtonElement) && (closeBtn instanceof HTMLButtonElement)) {
    openBtn.addEventListener('click', () => {
        dialog.showModal();
    });

    closeBtn.addEventListener('click', () => {
        dialog.close();
    });

    
}


if((textArea instanceof HTMLTextAreaElement) && (characterCounter instanceof HTMLSpanElement)) {
    textArea.addEventListener("input", () => {
        let remainingChars = 200 - textArea.value.length;
        
        characterCounter.textContent = `${remainingChars}`;

        characterCounter.style.color = remainingChars < 100 ? "red" : "white";
    });
}


