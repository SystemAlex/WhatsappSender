import manifest from "../../public/manifest.json";

export const MadeBy = () => {
  return (
    <div className="fixed bottom-2 left-2">
      <div className="p-4 text-center">
        <a
          href="https://github.com/SystemAlex/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#0286D9] hover:text-[#0170B0] dark:text-[#4DA6FF] dark:hover:text-[#66B3FF]"
        >
          v{manifest.version} by {manifest.author}
        </a>
      </div>
    </div>
  );
};
