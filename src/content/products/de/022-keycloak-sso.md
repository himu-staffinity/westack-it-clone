---
id: 22
title: Keycloak Single Sign-On
description: Sichere, skalierbare SSO für nahtlose Authentifizierung und Autorisierung.
icon: ../../../assets/images/products/keycloak.svg
iconPNG: ../../../assets/images/products/keycloak.png
tags: ["Keycloak-SSO-Implementierung","Keycloak SSO OpenID","SSO mit Keycloak","Keycloak SSO SAML","Keycloak realm","Keycloak SSO-","Keycloak SSO-Anmeldeseite","Keycloak SSO-Einrichtung","Keycloak Single Sign-On","Keycloak Kubernetes","Keycloak-Integration","Keycloak MFA"]
price: 50
lang: de
faq:
    - name: "Was ist Keycloak SSO?"
      acceptedAnswer: "Keycloak ist eine Open-Source-Lösung für die Identitäts- und Zugriffsverwaltung (IAM). Dank Single Sign-On (SSO) müssen sich Ihre Benutzer nur einmal authentifizieren, um Zugriff auf mehrere unabhängige Anwendungen zu erhalten."

    - name: "Wie geht Keycloak mit Social Logins um?"
      acceptedAnswer: "Mit Keycloak lassen sich zentrale Anmeldungen ganz einfach aktivieren. Sie können diese Funktionen über die Admin-Konsole aktivieren, ohne einen benutzerdefinierten Integrationscode schreiben zu müssen."

    - name: "Wie verbessert SSO unsere Sicherheitslage?"
      acceptedAnswer: "Durch die Zentralisierung der Authentifizierung reduzieren Sie die Angriffsfläche. Anstatt Anmeldedaten in zehn verschiedenen Apps zu sichern, sichern Sie einen zentralen Punkt mit robusten Funktionen wie Multi-Faktor-Authentifizierung (MFA), Passwortrichtlinien und Brute-Force-Erkennung."

    - name: "Können wir mehrere Projekte verwalten und das Branding für jedes einzelne anpassen?"
      acceptedAnswer: "Keycloak bietet leistungsstarke Mandantenfähigkeit durch eine Funktion namens „Realms“, die als isolierte Umgebungen fungieren, in denen Sie bestimmte Gruppen von Benutzern, Rollen und Sicherheitsrichtlinien verwalten können. Innerhalb jedes Bereichs haben Sie über benutzerdefinierte Designs die volle Kontrolle über die Benutzererfahrung, sodass Sie die Seiten für Anmeldung, Registrierung und Passwortzurücksetzung mit Ihrem eigenen HTML- und CSS-Code branden können. Das bedeutet, dass Sie mehrere unabhängige Projekte oder Kunden auf einer einzigen Installation hosten können, während Sie gleichzeitig sicherstellen, dass jedes Projekt seine eigene Unternehmensidentität und Datenisolation beibehält."

    - name: "Wie verwaltet Keycloak Sitzungszeitüberschreitungen?"
      acceptedAnswer: "Keycloak sorgt durch konfigurierbare Sitzungslimits für ein Gleichgewicht zwischen Sicherheit und Benutzererfahrung. Der SSO-Sitzungs-Leerlauf-Timer beendet Sitzungen nach einer bestimmten Zeit der Inaktivität, während der SSO-Sitzungs-Maximalwert als feste Grenze dient, die nach einer festgelegten Dauer unabhängig von der Aktivität eine erneute Authentifizierung erzwingt. Um die Sicherheit im Hintergrund zu gewährleisten, gibt Keycloak kurzlebige Zugriffstoken aus, die über Aktualisierungstoken stillschweigend aktualisiert werden, sodass Benutzer während der aktiven Arbeit angemeldet bleiben, ohne die Integrität des Systems zu gefährden."
---

Keycloak ist eine Open-Source-Lösung für die Identitäts- und Zugriffsverwaltung, deren Kernfunktion Single Sign-On (SSO) ist. Damit können sich Benutzer einmalig authentifizieren und nahtlos auf mehrere Cloud-Anwendungen oder -Dienste zugreifen, ohne sich wiederholt anmelden zu müssen. Dies vereinfacht die Authentifizierungs- und Autorisierungsabläufe, indem die Identitätsprüfung durch Standards wie OpenID Connect und SAML zentralisiert wird und gleichzeitig eine detaillierte Zugriffskontrolle über Rollen, Richtlinien und Multi-Faktor-Optionen ermöglicht wird. 

### Hauptfunktionen
* Unterstützung von OpenID Connect und SAML 2.0: Aktivieren Sie SSO mit standardbasierten Protokollen für eine schnelle Integration mit Webanwendungen, Mobilgeräten und APIs.
* Multi-Faktor-Authentifizierung (MFA): Fügen Sie mit TOTP, WebAuthn oder OTP zusätzliche Sicherheitsebenen für robuste Authentifizierungsabläufe hinzu.
* Benutzerföderation: Synchronisieren Sie Benutzer aus LDAP, Active Directory oder Datenbanken sowie Social Logins für hybride Authentifizierung.
* Fein abgestufte Autorisierung: Rollenbasierte Zugriffskontrolle, attributbasierte Zugriffskontrolle und Richtlinien für präzise Berechtigungen.
* Admin-Konsole und APIs: Intuitive Benutzeroberfläche zur Verwaltung von Realms, Clients und Benutzern mit REST-APIs für die Automatisierung in Kubernetes- oder Cloud-Umgebungen.
* Hohe Verfügbarkeit und Skalierbarkeit: Clustering, Caching und Helm-Chart-Unterstützung für produktionsreife Bereitstellungen in Ihrer Cloud-Infrastruktur.

### Hauptanwendungsbereiche
* Zentralisiertes SSO für SaaS-Dashboards: Vereinheitlichen Sie die Anmeldung über Ihr Benutzer-Dashboard, die Ressourcenverfolgung und den Marktplatz für verwaltete Apps hinweg und vermeiden Sie so die Ermüdung durch Passwörter.
* Microservices-Authentifizierung: Sichern Sie API-Gateways und -Dienste mit JWT-Tokens, ideal für TypeScript/Node.js-Anwendungen, die GitHub OAuth oder Cloudflare Workers verwenden.
* B2B- und Unternehmens-Onboarding: Bewältigen Sie komplexe Autorisierungen für Teams mit benutzerdefinierten Designs und Branding für White-Label-SSO.
* Compliance und Sicherheit: Erfüllen Sie die Anforderungen der DSGVO und HIPAA mit Audit-Protokollen, Sitzungsverwaltung und Brute-Force-Erkennung.
* DevOps-Workflows: Integrieren Sie CI/CD-Pipelines für die automatisierte Benutzerbereitstellung in Kubernetes-Clustern.

Keycloak macht Authentifizierung und Autorisierung zu einem Wettbewerbsvorteil, reduziert Probleme beim Anmelden, erhöht die Sicherheit und unterstützt außerdem die automatische Skalierung mit Karpenter für eine optimale Ressourcennutzung.

Stellen Sie es als verwaltete App auf Ihrer Plattform bereit, um Identitätsdienste auf Unternehmensniveau anzubieten, ohne sich um das Hosting von Grund auf kümmern zu müssen.