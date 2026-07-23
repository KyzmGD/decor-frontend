function Footer() {

  return (

    <footer
      className="
        bg-[#1F1F1F]
        text-white
        mt-20
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-16
          grid
          md:grid-cols-4
          gap-8
        "
      >

        <div>

          <h2
            className="
              text-2xl
              font-bold
            "
          >
            Woodora
          </h2>

          <p className="mt-4">
            Premium furniture
            for modern homes.
          </p>

        </div>

        <div>

          <h3
            className="
              font-semibold
              mb-4
            "
          >
            Shop
          </h3>

          <p>Sofas</p>
          <p>Tables</p>
          <p>Chairs</p>

        </div>

        <div>

          <h3
            className="
              font-semibold
              mb-4
            "
          >
            Company
          </h3>

          <p>About Us</p>
          <p>Contact</p>

        </div>

        <div>

          <h3
            className="
              font-semibold
              mb-4
            "
          >
            Follow
          </h3>

          <p>Facebook</p>
          <p>Instagram</p>

        </div>

      </div>

      <div
        className="
          text-center
          py-4
          border-t
          border-white/10
        "
      >
        © 2026 Woodora
      </div>

    </footer>

  );
}

export default Footer;