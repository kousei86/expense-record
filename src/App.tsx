import "./App.css";
import trashbox from "./assets/trashbox.svg";
import { useEffect, useState } from "react";

type Expense = {
  id: number;
  name: string;
  amount: number;
};

const loadExpenses = (): Expense[] => {
  const storageData = localStorage.getItem("expenseData");

  if (storageData === null) {
    return [
      { id: 1, name: "昼食", amount: 850 },
      { id: 2, name: "文房具", amount: 480 },
      { id: 3, name: "書籍", amount: 950 },
    ];
  }

  try {
    const data: unknown = JSON.parse(storageData);

    if (
      Array.isArray(data) &&
      data.every(
        (item) =>
          item !== null &&
          typeof item === "object" &&
          Number.isSafeInteger(item.id) &&
          item.id > 0 &&
          typeof item.name === "string" &&
          item.name.trim() !== "" &&
          Number.isSafeInteger(item.amount) &&
          item.amount > 0,
      )
    ) {
      return data as Expense[];
    }
  } catch {
    console.warn("保存データを読み込めませんでした");
  }

  return [];
};

const App = () => {
  const [inputName, setInputName] = useState<string>("");
  const [inputAmount, setInputAmount] = useState<string>("");
  const [items, setItems] = useState<Expense[]>(loadExpenses);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = inputName.trim();
    if (name === "") return;

    const amount = Number(inputAmount);
    if (
      inputAmount.trim() === "" ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !Number.isInteger(amount)
    )
      return;

    setItems((items) => {
      const newId = Math.max(0, ...items.map((item) => item.id)) + 1;
      return [...items, { id: newId, name: name, amount: amount }];
    });

    setInputName("");
    setInputAmount("");
  };

  const handleDelete = (id: number) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  useEffect(() => {
    const expenseData: string = JSON.stringify(items);
    localStorage.setItem("expenseData", expenseData);
  }, [items]);

  return (
    <div id="wrapper">
      <div id="app-area">
        <h1>支出記録</h1>
        <div id="sum-area">
          <h2>支出合計</h2>
          <div id="sum">
            <span className="yen-mark">&yen;</span>
            {totalAmount.toLocaleString("ja-JP")}
          </div>
        </div>
        <div>
          <form id="expense-form" onSubmit={handleSubmit}>
            <div id="item-input-area">
              <label htmlFor="item-form">品目</label>
              <input
                type="text"
                name="item"
                id="item-form"
                placeholder="ハンバーガー"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
              />
            </div>
            <div id="amount-input-area">
              <label htmlFor="amount-form">金額</label>
              <input
                type="number"
                name="amount"
                id="amount-form"
                placeholder="1000"
                min="1"
                step="1"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
              />
            </div>
            <div id="button-area">
              <button type="submit" id="add-button">
                ＋
              </button>
            </div>
          </form>
          <div className="note">
            <p>
              ［データについて］
              <br />
              <span className="description">
                ・支出記録は、Webブラウザの Local storage に「 ExpenseData
                」という名前で自動保存されます。
                <br />
              </span>
              <span className="description">
                ・支出記録がサーバーに送信されることはありません。
              </span>
            </p>
          </div>
          <div id="item-list-area">
            <ul id="item-list">
              {items.map((item) => (
                <li key={item.id} className="item">
                  <div className="item-name">{item.name}</div>
                  <div className="item-amount">
                    <span className="yen-mark">&yen;</span>
                    {item.amount.toLocaleString("ja-JP")}
                  </div>
                  <button
                    type="button"
                    className="trashbox-button"
                    aria-label={`${item.name}を削除`}
                    onClick={() => handleDelete(item.id)}
                  >
                    <img
                      src={trashbox}
                      alt="trashbox"
                      className="trashbox-img"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
