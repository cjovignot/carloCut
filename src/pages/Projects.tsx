const ProjectCard = ({ project }: { project: any }) => {
  const [translateX, setTranslateX] = useState(0);
  const maxSwipe = 150; // largeur totale du panneau d'actions
  const buttonWidth = maxSwipe / 2;

  const handlers = useSwipeable({
    onSwipedLeft: () => setTranslateX(-maxSwipe),
    onSwipedRight: () => setTranslateX(0),
    onSwiping: (eventData) => {
      // on limite translateX entre 0 et -maxSwipe
      let x = Math.max(Math.min(-eventData.deltaX, maxSwipe), 0);
      setTranslateX(-x);
    },
    trackMouse: true,
  });

  return (
    <div className="relative w-full">
      {/* Actions derrière */}
      <div className="absolute top-0 right-0 h-full flex overflow-hidden">
        {/* Edit Button */}
        <div
          style={{
            width: buttonWidth,
            transform: `translateX(${Math.min(translateX + buttonWidth, 0)}px)`,
            transition: "transform 0.1s linear",
          }}
        >
          <button
            className="flex items-center justify-center h-full w-full text-white"
            style={{ backgroundColor: "var(--color-edit-btn, #6B7280)" }}
            onClick={() => setEditingProject(project)}
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>

        {/* Delete Button */}
        {user?.role === "admin" && (
          <div
            style={{
              width: buttonWidth,
              transform: `translateX(${Math.min(translateX + maxSwipe, 0)}px)`,
              transition: "transform 0.1s linear",
            }}
          >
            <button
              className="flex items-center justify-center h-full w-full text-white"
              style={{ backgroundColor: "var(--color-delete-btn, #EF4444)" }}
              onClick={() => handleDeleteProject(project._id)}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Contenu de la card */}
      <div
        {...handlers}
        className="flex flex-col transition-transform duration-200 rounded-lg shadow-md overflow-hidden"
        style={{
          transform: `translateX(${translateX}px)`,
          backgroundColor: "var(--color-card-bg)",
        }}
      >
        <div className="p-4">
          <h3
            style={{ color: "var(--color-card-text)" }}
            className="mb-2 text-lg font-semibold"
          >
            {project.name}
          </h3>

          <div className="flex flex-col w-full space-y-2">
            <div
              className="flex items-center text-sm"
              style={{ color: "var(--color-secondary)" }}
            >
              <MapPin className="w-4 h-4 mr-2" />
              <span className="truncate">{project.client}</span>
            </div>

            <div className="text-sm">
              <span style={{ color: "var(--color-info)" }}>
                {project.joineries.length}{" "}
                {project.joineries.length === 1 ? "menuiserie" : "menuiseries"}
              </span>
            </div>

            <div
              className="flex items-center text-sm"
              style={{ color: "var(--color-card-text)" }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(project.date).toLocaleDateString()}</span>
            </div>

            <div
              className="text-xs mt-2"
              style={{ color: "var(--color-accent)" }}
            >
              par {project.createdBy?.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};