// interface ProfileOptionProps {
//   type: string;
//   selected: boolean;
//   onSelect: () => void;
// }

// const profileThumbnails: Record<
//   string,
//   (width?: number, height?: number) => string
// > = {
//   tableau: (w = 100, h = 5, lip = 2) => `
//     M0 ${h}
//     L0 0
//     L${w} 0
//     L${w} ${h}
//     L${w - lip} ${h}
//     L${w - lip} ${h - lip}
//     L${lip} ${h - lip}
//     L${lip} ${h}
//     Z
//   `,
//   linteau: (w = 100, h = 40, lip = 10) => `
//     M0 0
//     L0 ${h}
//     L${w} ${h}
//     L${w} ${h - lip}
//     L${lip} ${h - lip}
//     L${lip} ${lip}
//     L${w} ${lip}
//     L${w} 0
//     Z
//   `,
//   appui: (w = 100, h = 20, lip = 10) => `
//     M0 0
//     L0 ${h}
//     L${w} ${h}
//     L${w} 0
//     L${w - lip} 0
//     L${w - lip} ${h - lip}
//     L${lip} ${h - lip}
//     L${lip} 0
//     Z
//   `,
//   custom: (w = 80, h = 40) => `
//     M0 0
//     L${w} 0
//     L${w} ${h}
//     L0 ${h}
//     Z
//   `,
// };

// export function ProfileOption({
//   type,
//   selected,
//   onSelect,
// }: ProfileOptionProps) {
//   const svgPath = profileThumbnails[type] || profileThumbnails.custom;

//   return (
//     <div
//       onClick={onSelect}
//       className={`cursor-pointer p-2 border rounded ${
//         selected ? "border-blue-500 bg-blue-50" : "border-gray-200"
//       }`}
//     >
//       <svg width={100} height={50} viewBox="0 0 100 50">
//         <path
//           d={svgPath()}
//           fill="#000000ff"
//           fillOpacity="0.3"
//           // stroke="#303030ff"
//           strokeWidth="2"
//         />
//       </svg>
//       <div className="mt-1 text-xs text-center">{type}</div>
//     </div>
//   );
// }
