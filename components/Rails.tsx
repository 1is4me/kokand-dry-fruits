export default function Rails({ scrollLabel }: { scrollLabel: string }) {
  return (
    <>
      <div className="rail rail--right">
        <span className="rail__text">{scrollLabel}</span>
        <span className="rail__dot" />
        <span className="rail__line" />
      </div>
    </>
  );
}
