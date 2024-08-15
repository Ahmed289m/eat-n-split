import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFF, setShowAddFF] = useState(false);
  const [currentFriends, setCurrentFriends] = useState(initialFriends);
  const [selectedF, setSelectedF] = useState(null);

  function handleSelection(friend) {
    setSelectedF((currentSelected) =>
      currentSelected?.id === friend.id ? null : friend
    );
    setShowAddFF(false);
  }

  function handleShowFF() {
    setShowAddFF((show) => !show);
  }

  function handleShowNewF(friend) {
    setCurrentFriends((fr) => [...fr, friend]);
    setShowAddFF(false);
  }

  function handleSplitBill(value) {
    setCurrentFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedF.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedF(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FreindsList
          friends={currentFriends}
          onSelection={handleSelection}
          selectedF={selectedF}
        />
        {showAddFF && <FormAddFreind onAdd={handleShowNewF} />}
        <Button onClick={handleShowFF}>
          {showAddFF ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedF && (
        <FormBillSplit selectedFr={selectedF} onSplit={handleSplitBill} />
      )}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function FreindsList({ friends, onSelection, selectedF }) {
  return (
    <ul>
      {friends.map((Friends) => (
        <Friend
          Freind={Friends}
          id={Friends.id}
          onSelection={onSelection}
          selectedF={selectedF}
        />
      ))}
    </ul>
  );
}

function Friend({ Freind, onSelection, selectedF }) {
  const isSelected = selectedF?.id === Freind.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={Freind.image} alt="Freind-name" />
      <h3>{Freind.name}</h3>
      {Freind.balance < 0 && (
        <p className="red">
          you awe {Freind.name} {Math.abs(Freind.balance)}$
        </p>
      )}

      {Freind.balance > 0 && (
        <p className="green">
          {Freind.name} awes you {Math.abs(Freind.balance)}$
        </p>
      )}

      {Freind.balance === 0 && <p>you and {Freind.name} are even</p>}

      <Button onClick={() => onSelection(Freind)}>Select</Button>
    </li>
  );
}

function FormAddFreind({ onAdd }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const newFriend = {
      name,
      image,
      balance: 0,
      id: crypto.randomUUID,
    };
    onAdd(newFriend);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Friend image</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormBillSplit({ selectedFr, onSplit }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const friendExpense = bill - userExpense;
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !userExpense) return;
    onSplit(whoIsPaying === "user" ? friendExpense : -userExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a Bill with {selectedFr?.name}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>Your Expense</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          setUserExpense(
            Number(e.target.value) > bill ? userExpense : Number(e.target.value)
          )
        }
      />

      <label>{selectedFr?.name}'s Expense</label>
      <input type="text" disabled value={friendExpense} />

      <label>Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFr?.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
