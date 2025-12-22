import React from 'react';

const ProjectList = () => {
  const projects = [
    {
      id: 1,
      title: "Splendor Explorer",
      url: "https://splendor.kafagoz.com/",
      description: "Browse and filter Splendor development cards, simulate your gem hand to see what you can afford."
    },
    {
      id: 2,
      title: "Free Fall Simulator",
      url: "https://freefall.kafagoz.com/",
      description: "Interactive physics simulator for free fall with real-time charts."
    },
    {
      id: 3,
      title: "Wort",
      url: "https://wort.kafagoz.com/",
      description: "A small matching game to practice German ↔ English vocabulary in Duolingo style."
    },
    {
      id: 4,
      title: "Catan Board Generator",
      url: "https://catan.wunnle.com/",
      description: "Randomized Catan boards with pip/resource rules and adjacency controls."
    },
    {
      id: 5,
      title: "Deterministic Catan",
      url: "https://deterministic-catan.wunnle.com/",
      description: "A Catan variant with a pre-generated dice sequence revealed roll by roll, reducing luck."
    },
    {
      id: 6,
      title: "Clueless by Sinan",
      url: "https://clueless.wunnle.dev/",
      description: "A fork of Clues by Sam with the puzzle removed, showing how long it takes to \"solve\" nothing."
    },
    {
      id: 7,
      title: "Lorentz Force Simulator",
      url: "https://lorentz.wunnle.dev/",
      description: "An interactive simulation of the Lorentz force (F = q(E + v × B)) using HTML5 Canvas."
    }
  ];

  return (
    <ul>
      {projects.map(project => (
        <li key={project.id}>
          <h2>
            <a href={project.url}>{project.title}</a>
          </h2>
          <p dangerouslySetInnerHTML={{ __html: project.description }} />
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;