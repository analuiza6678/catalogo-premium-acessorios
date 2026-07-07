export function DecorativeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#FFFDF9]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(248,221,235,0.75),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(232,199,102,0.22),transparent_24%),radial-gradient(circle_at_50%_72%,rgba(250,243,232,0.9),transparent_34%)]" />
      <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(201,162,39,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(201,162,39,0.08)_1px,transparent_1px)] [background-size:78px_78px]" />
    </div>
  );
}
