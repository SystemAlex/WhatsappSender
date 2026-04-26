import manifest from "../../public/manifest.json";

export const MadeBy = () => {
  return (
    <div className="fixed bottom-4 left-4">
      <div className="text-center">
        <a
          href="https://github.com/SystemAlex/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#0286D9] hover:text-[#0170B0]"
        >
          v{manifest.version} by {manifest.author}
        </a>
      </div>
    </div>
  );
};
