Feature: Certification

  Background:
    Given les données de test sont chargées

  Scenario: Je commence une certification avec un profil non certifiable
    Given je vais sur Pix
    And je suis connecté à Pix

    When je vais sur la page de démarrage des certifications
    Then je vois la page de lancement du test de certification

    When je tape le code "GHI56" et je clique sur "Lancer le test"
    Then je vois que mon profil n'est pas encore certifiable
