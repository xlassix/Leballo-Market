import Link from "next/link";
import { useState, useEffect } from "react";
function Table({ header, rows }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(function () {
      setCount(count + 1);
    }, 19000);
  }, []);

  function secondsToHms(d) {
    d = new Date().getTime() / 1000 - Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
  }
  const _header = header ? header : ["No data"];
  const _rows = rows
    ? rows.length > 0
      ? rows
      : [{ "No data": "No data" }]
    : [{ "No data": "No data" }];
  return (
    <table>
      <thead>
        <tr key={"header"}>
          {_header.map((elem, ind) => (
            <th key={elem + ind}>{elem}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {_header.toString() === ["No data"].toString() ? (
          <div className="center-div">
            <p className="nodata">No Data</p>
          </div>
        ) : (
          _rows.map((elem, ind) => {
            return (
              <Link
                key={ind + "link"}
                href={
                  elem["tx"]
                    ? `https://mumbai.polygonscan.com/tx/${elem["tx"]}`
                    : "#"
                }
                passHref
              >
                <tr key={"row" + ind} onClick={() => console.log(elem)}>
                  {_header.map((header) =>
                    header == "tx" ? (
                      <td>
                        <a
                          key={header + "X" + ind}
                          href={
                            elem["tx"]
                              ? `https://mumbai.polygonscan.com/tx/${elem["tx"]}`
                              : "#"
                          }
                          rel="noopener noreferrer"
                        >
                          <svg
                            viewBox="0 0 512 512"
                            xmlSpace="preserve"
                            height="20px"
                          >
                            <path d="M144.25 0l-32 352H14.875v80c0 44.125 35.875 80 80 80h288c44.125 0 80 -35.875 79.938 -78.781L496.125 0H144.25zM94.875 480c-26.5 0 -48 -21.531 -48 -48v-48h256v48c0 18 5.938 34.625 16 48H94.875zM430.875 432c0 26.469 -21.563 48 -48 48c-26.5 0 -48 -21.531 -48 -48v-80h-190.5L173.5 32h288.063L430.875 432zM385.125 192H223.188l2.938 -32h161.438L385.125 192zM390 128H229l2.938 -32H392.5L390 128zM252.188 256h-34.813l2.875 -32h34.375L252.188 256zM284.25 224h66.375l-2.438 32h-66.813L284.25 224z" />
                          </svg>
                        </a>
                      </td>
                    ) : header == "timestamp" ? (
                      <td key={header + " " + ind}>
                        {secondsToHms(elem[header])}
                      </td>
                    ) : (
                      <td key={header + " " + ind}>{elem[header]}</td>
                    )
                  )}
                </tr>
              </Link>
            );
          })
        )}
      </tbody>
    </table>
  );
}

export default Table;
