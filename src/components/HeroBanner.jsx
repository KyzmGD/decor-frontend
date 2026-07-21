function HeroBanner() {
  return (
    <section className="bg-gray-200">

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-20
        "
      >
        <h1
          className="
            text-5xl
            font-bold
            mb-4
          "
        >
          Modern Furniture
        </h1>

        <p className="mb-6">
          Decorate your dream home
        </p>

        <button
          className="
            bg-black
            text-white
            px-6
            py-3
            rounded
          "
        >
          Shop Now
        </button>
      </div>

    </section>
  );
}

export default HeroBanner;