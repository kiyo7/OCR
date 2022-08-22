import React, { useState } from "react";
import { createWorker } from "tesseract.js";
import "./App.css";

const options = [
  {
    label: "日本語",
    value: "jpn",
  },
  {
    label: "英語",
    value: "eng",
  },
];
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [ocr, setOcr] = useState("");
  const [img, setImg] = useState<any>(null);
  const [lang, setLang] = useState("jpn");

  const worker = createWorker({
    logger: (m) => console.log(m),
  });
  const doOCR = async () => {
    setIsLoading(true);
    await worker.load();
    await worker.loadLanguage(lang);
    await worker.initialize(lang);
    const {
      data: { text },
    } = await worker.recognize(img);
    setOcr(text);
    setIsLoading(false);
  };

  const uploadImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      throw new Error("画像ファイルを選択して下さい!");
    }

    const file = e.target.files[0];
    setImg(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value);
  };

  if (isLoading)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="m-auto my-5 h-12 w-12 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
      </div>
    );

  return (
    <div className="App flex flex-col justify-center items-center">
      <input type="file" onChange={uploadImg} />
      <label className="mt-10" htmlFor="lang-select">
        言語を選択してください
      </label>

      <select
        className="my-10"
        name="lang"
        id="lang-select"
        onChange={handleChange}
      >
        {options.map((option, key) => (
          <option key={key} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button className="my-10" onClick={() => doOCR()}>
        解析する
      </button>
      <p>解析した文字↓</p>
      <p>{ocr}</p>
    </div>
  );
}

export default App;
