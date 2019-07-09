Feature: Demo

  Scenario: Je lance une démo pour Mathématiques
    Given je vais sur Pix
    When je lance le course "rec5UecGJn0kr2odZ"
    Then je suis redirigé vers une page d'épreuve
    And le titre sur l'épreuve est "Démo mathématiques"
