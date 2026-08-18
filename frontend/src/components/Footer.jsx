import React from 'react';

export const Footer = () => {
  return (
    <footer className="app-footer text-center py-3 mt-auto">
      <small>
        &copy; {new Date().getFullYear()} <strong>Data Ingénierie</strong>
        &mdash; Bureau d'études statistiques au Maroc
        &mdash; Plateforme de collecte de données terrain
      </small>
    </footer>
  );
};
