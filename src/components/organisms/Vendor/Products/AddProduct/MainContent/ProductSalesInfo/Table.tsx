import { HandleImageMain } from "../ClassifyContent/HandleImageMain";

interface Row {
  color: string;
  sizes: string[];
  price: string;
  stock: string;
  sku: string;
  hasImage: boolean;
}

export const Table_v2 = () => {
  const rows = [
    {
      color: "Red",
      sizes: ["S", "M", "L"],
      price: "Nhập vào",
      stock: "0",
      sku: "Nhập vào",
      hasImage: true, // Kiểm tra xem có hình ảnh hay không
    },
    {
      color: "Red",
      sizes: ["S", "M", "L"],
      price: "Nhập vào",
      stock: "0",
      sku: "Nhập vào",
      hasImage: true, // Kiểm tra xem có hình ảnh hay không
    },
    {
      color: "Red",
      sizes: ["S", "M", "L"],
      price: "Nhập vào",
      stock: "0",
      sku: "Nhập vào",
      hasImage: true, // Kiểm tra xem có hình ảnh hay không
    },
    // Add more colors as needed
  ];

  const renderColorCell = (row: Row, sizeIndex: number) => {
    console.log("sizeIndex", sizeIndex);
    if (sizeIndex === 0) {
      return (
        <td
          rowSpan={row.sizes.length}
          className="border px-4 py-2 "
          style={{ textAlign: "center", verticalAlign: "middle" }}
        >
          <div className="flex flex-col justify-center items-center ">
            {row.color}

            {row.hasImage && (
              // <div
              //   id="can-drag vtc-image-manager__itembox"
              //   className="w-[96px] mb-[16px] mr-[16px] max-w-[80px] max-h-[80px]"
              // >
              //   <div id="popover-wrap" className=" h-[80px]">
              //     <div
              //       id="shopee-image-manager__content content-fill"
              //       className="relative h-full"
              //     >
              //       <img
              //         src="https://vienthonga.com/wp-content/uploads/2023/05/ChatGPT-GPT-4-2.jpg"
              //         alt="image"
              //         className="absolute border-[0.8px] "
              //         style={{ border: "2px solid black" }} // Add this line
              //       />
              //       <div
              //         id="shopee-image-manager__tools"
              //         className="flex justify-center gap-3 absolute bottom-0 right-0 left-0 h-[24px] w-[80px]
              //       bg-[#D6D3D1] bg-opacity-100"
              //       >
              //         <span
              //           id="shopee-image-manager__icon shopee-image-manager__icon--crop"
              //           className=" w-[24px] h-[24px]
              //          flex items-center justify-center cursor-pointer
              //         "
              //           //   onClick={handleCropClick}
              //         >
              //           <i id="shopee-icon" className="h-[16px] w-[16px]">
              //             <span className="h-auto w-auto">
              //               <svg
              //                 version="1.0"
              //                 xmlns="http://www.w3.org/2000/svg"
              //                 width="16"
              //                 height="16"
              //                 viewBox="0 0 1.2 1.2"
              //                 xmlSpace="preserve"
              //               >
              //                 <path
              //                   fill="none"
              //                   stroke="#000"
              //                   strokeWidth="0.037500000000000006"
              //                   strokeMiterlimit="10"
              //                   d="M0 0.206h0.994V1.2"
              //                 />
              //                 <path
              //                   fill="none"
              //                   stroke="#000"
              //                   strokeWidth="0.037500000000000006"
              //                   strokeMiterlimit="10"
              //                   d="M0.206 0v0.994H1.2m-0.994 0 0.975 -0.975"
              //                 />
              //               </svg>
              //             </span>
              //           </i>
              //         </span>
              //         <span
              //           id="decollator"
              //           className="border-l h-auto w-[1px] border-gray-400"
              //         ></span>
              //         <span
              //           id="shopee-image-manager__icon shopee-image-manager__icon--delete"
              //           className=" w-[24px] h-[24px]
              //          flex items-center justify-center cursor-pointer
              //         "
              //         >
              //           <i id="shopee-icon" className="h-[16px] w-[16px]">
              //             <span>
              //               <svg
              //                 width="16"
              //                 height="16"
              //                 viewBox="0 0 20.48 20.48"
              //                 className="icon"
              //                 xmlns="http://www.w3.org/2000/svg"
              //               >
              //                 <path d="M3.2 5.12H1.92a.64.64 0 0 1 0-1.28h5.12V1.919a.64.64 0 0 1 .64-.64h5.12a.64.64 0 0 1 .64.64V3.84h5.12a.64.64 0 1 1 0 1.28h-1.28v13.44a.64.64 0 0 1-.64.64H3.84a.64.64 0 0 1-.64-.64V5.12zm8.96-1.28V2.56H8.32v1.28h3.84zM4.48 17.92H16V5.12H4.48v12.8zm3.84-2.56a.64.64 0 0 1-.64-.64v-6.4a.64.64 0 0 1 1.28 0v6.4a.64.64 0 0 1-.64.64zm3.84 0a.64.64 0 0 1-.64-.64v-6.4a.64.64 0 0 1 1.28 0v6.4a.64.64 0 0 1-.64.64z" />
              //               </svg>
              //             </span>
              //           </i>
              //         </span>
              //       </div>
              //     </div>
              //   </div>
              // </div>
              <HandleImageMain />
            )}
          </div>
        </td>
      );
    }
    return null;
  };

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="px-4 py-2">MÀU SẮC</th>
          <th className="px-4 py-2">SIZE</th>
          <th className="px-4 py-2">Giá</th>
          <th className="px-4 py-2">Kho hàng</th>
          <th className="px-4 py-2">SKU phân loại</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) =>
          row.sizes.map((size, sizeIndex) => (
            <tr key={`${index}-${sizeIndex}`}>
              {renderColorCell(row, sizeIndex)}
              <td className="border px-4 py-2">{size}</td>
              <td className="border px-4 py-2">{row.price}</td>
              <td className="border px-4 py-2">{row.stock}</td>
              <td className="border px-4 py-2">{row.sku}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
