interface SheetVisualizationProps {
  sheet: {
    profileType: string;
    dimensions: number[];
    thickness: number;
    material: string;
    color: string;
    length: number;
  };
}

export function SheetVisualization({ sheet }: SheetVisualizationProps) {
  const generatePath = () => {
    const { profileType, dimensions } = sheet;

    // Simple profile generation based on type
    switch (profileType) {
      case "sill":
        return generateSillProfile(dimensions);
      case "jamb":
        return generateJambProfile(dimensions);
      case "lintel":
        return generateLintelProfile(dimensions);
      default:
        return generateGenericProfile(dimensions);
    }
  };

  const generateSillProfile = (dims: number[]) => {
    const width = dims[0] || 100;
    // const height = dims[1] || 40;

    return `
      M 10 30
      L ${width - 10} 30
      L ${width} 20
      L ${width} 10
      L 10 10
      L 0 20
      Z
    `;
  };

  const generateJambProfile = (dims: number[]) => {
    const width = dims[0] || 60;
    const height = dims[1] || 120;

    return `
      M 10 10
      L ${width - 10} 10
      L ${width} 20
      L ${width} ${height - 20}
      L ${width - 10} ${height}
      L 10 ${height}
      L 0 ${height - 20}
      L 0 20
      Z
    `;
  };

  const generateLintelProfile = (dims: number[]) => {
    const width = dims[0] || 120;
    const height = dims[1] || 50;

    return `
      M 0 10
      L 10 0
      L ${width - 10} 0
      L ${width} 10
      L ${width} ${height}
      L 0 ${height}
      Z
    `;
  };

  const generateGenericProfile = (dims: number[]) => {
    const width = dims[0] || 80;
    const height = dims[1] || 60;

    return `
      M 0 0
      L ${width} 0
      L ${width} ${height}
      L 0 ${height}
      Z
    `;
  };

  const viewBoxWidth = Math.max(...sheet.dimensions, 100);
  const viewBoxHeight = sheet.dimensions[1] || 60;

  return (
    <div className="p-4 rounded-lg bg-gray-50">
      <h4 className="mb-3 text-sm font-medium text-gray-900">
        Technical Drawing
      </h4>

      <div className="p-4 bg-white border rounded">
        <svg
          width="100%"
          height="200"
          viewBox={`0 0 ${viewBoxWidth + 20} ${viewBoxHeight + 20}`}
          className="border"
        >
          {/* Grid lines */}
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Profile */}
          <path
            d={generatePath()}
            fill="#3b82f6"
            fillOpacity="0.3"
            stroke="#2563eb"
            strokeWidth="2"
            transform="translate(10, 10)"
          />

          {/* Dimensions */}
          {sheet.dimensions.map((dim, index) => (
            <g key={index}>
              <text
                x={index === 0 ? viewBoxWidth / 2 : viewBoxWidth + 5}
                y={index === 0 ? viewBoxHeight + 15 : viewBoxHeight / 2}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {dim}mm
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex justify-between mt-3 text-xs text-gray-600">
        <span>Profile: {sheet.profileType}</span>
        <span>Scale: Not to scale</span>
      </div>
    </div>
  );
}
