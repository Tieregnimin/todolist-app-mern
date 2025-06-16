function Footer() {
  return (
    <footer className="bg-blue-600 text-white text-center py-4 mt-10 shadow-inner">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} MaToDoList — Tous droits réservés.
      </p>
    </footer>
  );
}

export default Footer;
