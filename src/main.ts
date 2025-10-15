import type{Fact, FactInsert, Sorting, Category} from "./types/utils"

//Select container
const items = document.querySelector(".items") as HTMLDivElement;
const loader = document.createElement("div");
const factSection = document.querySelector(".items") as HTMLElement
const factForm = document.getElementById("factForm") as HTMLFormElement
const modal = document.getElementById("modal") as HTMLDialogElement
const categoriesSection = document.querySelector(".categories") as HTMLElement
const factsBar = document.querySelector(".facts-bar") as HTMLDivElement
//Add loader to DOM
if (loader instanceof HTMLDivElement) {
  loader.className = "loader";
  loader.style.display = "none";
  loader.style.margin = "40px auto";
  if (items.parentNode) {
    items.parentNode.insertBefore(loader, items);
  }
}

//Event delegation for avoiding redundant code
factSection.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as HTMLElement;


  const votesContainer = target.closest(".facts-item-reactions-votes");
  const factEl = target.closest(".facts-item") as HTMLElement | null;
  if (!factEl) return

  const id = Number(factEl.dataset.id);
  const indexToEdit = facts.findIndex(fact => fact.id === id)
  if (hasVoted(id)) {
    alert("You have already voted")
    return
  };
  if (target.matches(".facts-item-reactions-positive")) {
    console.log("Pressed liked fact:", id);
    console.log("The index to edit is: ", indexToEdit)
    //Updating the database, local array, DOM and local storage
    if (indexToEdit !== -1) {
      updateFact(id, "positive", facts[indexToEdit].votes_positive)
      facts[indexToEdit].votes_positive += 1
      console.log(facts)
      const votesText = votesContainer?.querySelector("p");
      if (votesText) {
        votesText.textContent = String(Number(votesText.textContent) + 1);
      }
      localStorage.setItem(`voted-${id}`, "true");
    }


  } else if (target.matches(".facts-item-negative")) {
    console.log("Pressed negative fact:", id);
    //Updating the database and local array
    if (indexToEdit !== -1) {
      updateFact(id, "negative", facts[indexToEdit].votes_negative)
      facts[indexToEdit].votes_negative += 1
      console.log(facts)
      const votesText = votesContainer?.querySelector("p");
      if (votesText) {
        votesText.textContent = String(Number(votesText.textContent) + 1);
      }
      localStorage.setItem(`voted-${id}`, "true");
    }
  }
})

//Trigger function once window loads
window.onload = () => {
  loadFacts()
};

//Main variables

let facts: Fact[] = [];
let selectedCategory: Category = "all";
let selectedSort: Sorting = null;



//Load facts 
async function loadFacts() {
    loader.style.display = "block";
    items.style.display = "none";
    try {
        const response = await fetch("/api/facts");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        facts = data;
        console.log("FACTS:", data);
        displayfacts(data)
    } catch (error) {
        console.error("Error fetching facts:", error);
    } finally {
        loader.style.display = "none";
        items.style.display = "";
    }
}

//Create fact
function createFactElement(fact: Fact): void {
    const child = `  
    <div class="facts-item" data-id="${fact.id}" style="opacity: 0; transform: translateY(-20px); transition: opacity 0.3s ease, transform 0.3s ease;">
        <div class="fact-item-bar">
          <div class="facts-item-bar-category ${fact.category}">
            ${fact.category.charAt(0).toUpperCase() + fact.category.slice(1)}
          </div>
            <div class="facts-item-bar-source">
              <a class="source" href="${fact.source}">Source</a>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link source-icon">
                  <path d="M15 3h6v6"></path>
                  <path d="M10 14 21 3"></path>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                </svg>
            </div>
        </div>
          <p class="facts-item-paragraph">${fact.text}</p>
            <div class="facts-item-reactions">
              <div class="facts-item-reactions-votes positive">
                <button class="facts-item-reactions-positive">👍</button>
                <p style="display:inline-block">${fact.votes_positive}</p>
              </div>
              <div class="facts-item-reactions-votes negative">
                <button class="facts-item-negative">👎</button>
                <p style="display:inline-block">${fact.votes_negative}</p>
              </div>
            </div>
    </div>
  `;
    items.insertAdjacentHTML("afterbegin", child);
    
    // Trigger animation
    const newElement = items.firstElementChild as HTMLElement;
    if (newElement) {
        setTimeout(() => {
            newElement.style.opacity = "1";
            newElement.style.transform = "translateY(0)";
        }, 10);
    }
}

function displayfacts(dataArray:Fact[]){
    items.innerHTML="";
    dataArray.forEach((fact)=>{
        createFactElement(fact);
    })

}




async function updateFact(id:number, type:"positive"|"negative", currentVotes:number):Promise<void>{
  try {
    const response = await fetch("/api/vote", {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        id:id,
        type:type,
        currentVotes:currentVotes
      }),
    })
    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json();
    console.log("Vote updated: ", result)

  } catch (error) {
    console.error("Error updating vote:", error);
  }
}

function hasVoted(id: number): boolean {
  return !!localStorage.getItem(`voted-${id}`);
}

//FORM HANDLING
factForm.addEventListener("submit", async function (event){
  event.preventDefault();
  event.preventDefault();
  const formData = new FormData(this);
  const fact = formData.get("fact") as string;
  const source = formData.get("source") as string;
  const category = formData.get("category") as string;
  const newFact = {
    text: fact,
    source: source,
    category: category.toLowerCase(),
  };
  //create fact and update the database, also update the fact locally insteadd of re fetching
  
  // Add the new fact to local array and display it
  modal.close()
  const result = await createFact(newFact);
  facts.unshift(result.data);
  createFactElement(result.data);
  
  //-----
  this.reset()
})



async function createFact(factData:FactInsert) {
  try {
    const response = await fetch("/api/create-fact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(factData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Fact inserted correctly", result);
    return result;
  } catch (error) {
    console.error("Error inserting fact:", error);
    throw error;
  }
}

categoriesSection.addEventListener("click", (event:MouseEvent)=>{
  let target = event.target as HTMLButtonElement
  if (target.matches(".categories-button")){
    filterByCategory(target.dataset.category as Category)
  }
})

factsBar.addEventListener("click", (event:MouseEvent)=>{
  let target = event.target as HTMLButtonElement
  console.log(target)
  if (target.matches(".button-facts-button")){
    sortBy(target.dataset.factsort as Sorting)
  }
})



function filtering(){
  let filterType = selectedCategory === "all" ? [...facts] : facts.filter(fact => fact.category === selectedCategory);

  if (selectedSort === "newest") {
    filterType.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  } else if (selectedSort === "popularity") {
    filterType.sort((a, b) => (a.votes_positive + a.votes_negative) - (b.votes_positive + b.votes_negative));
  }

  displayfacts(filterType);
}

// Then your event handlers just update state and call this:
function filterByCategory(category: Category) {
  selectedCategory = category;
  filtering();  // Reapply with new category
}

function sortBy(sort: Sorting) {
  selectedSort = sort;
  filtering();  // Reapply with new sort
}