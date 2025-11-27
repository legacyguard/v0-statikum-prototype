#!/usr/bin/env python3
"""
Script to generate mock cadastral ownership record (List vlastnictví) PDF file.
"""
import sys

content = """
═══════════════════════════════════════════════════════════════
              ČESKÝ ÚŘAD ZEMĚMĚŘICKÝ A KATASTRÁLNÍ
                    LIST VLASTNICTVÍ (MOCK)
═══════════════════════════════════════════════════════════════

Katastrální území:  Býšť
Číslo LV:           1234
Stav k datu:        30.06.2025

───────────────────────────────────────────────────────────────
A. VLASTNÍK / SPOLUVLASTNÍCI
───────────────────────────────────────────────────────────────

Zemědělská akciová společnost Býšť
IČO: 12345678
Sídlo: Býšť 123, 123 45 Býšť
Podíl: 1/1

───────────────────────────────────────────────────────────────
B. NEMOVITOSTI
───────────────────────────────────────────────────────────────

Parcely:

P.č.      Druh pozemku           Výměra (m²)    Způsob využití
───────────────────────────────────────────────────────────────
123/1     Orná půda               125,430        Orná půda
123/2     Orná půda               87,560         Orná půda
124       Trvalý travní porost    15,230         Louka
125       Orná půda               96,780         Orná půda
126/1     Zastavěná plocha         2,450         Stavba
126/2     Ostatní plocha           1,120         Manipulační plocha
127       Orná půda               143,670        Orná půda

Celková výměra pozemků:          472,240 m²

Stavby na pozemcích:

Stavba č.p.    Typ stavby                    Adresa
───────────────────────────────────────────────────────────────
č.p. 123       Zemědělská usedlost          Býšť č.p. 123
bez č.p.       Provozní budova              parcela 126/1

───────────────────────────────────────────────────────────────
C. OMEZENÍ VLASTNICKÉHO PRÁVA
───────────────────────────────────────────────────────────────

Zástavní právo:

Oprávněný:     Česká spořitelna, a.s.
               IČO: 45244782
Listina:       Smlouva o zřízení zástavního práva č. 2023/4567
               ze dne 15.03.2023
Výše závazku:  15,000,000 Kč
Účel:          Zajištění úvěru č. 2023-UV-123456

───────────────────────────────────────────────────────────────
D. JINÉ ZÁPISY
───────────────────────────────────────────────────────────────

Věcné břemeno - právo cesty:

Oprávněný:     Obec Býšť
Listina:       Smlouva o zřízení věcného břemene ze dne 12.01.2020
Rozsah:        Právo chůze a jízdy přes parcelu 123/1
               (šíře 4 m, dle geometrického plánu č. GP-123/2020)

───────────────────────────────────────────────────────────────

Tento list vlastnictví je MOCK dokument vytvořený pro účely
demonstrace a prototypování. Nejedná se o oficiální dokument
Českého úřadu zeměměřického a katastrálního.

Vygenerováno: 2025-06-30
"""

try:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import cm
    from reportlab.pdfgen import canvas
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    import textwrap

    output_path = sys.argv[1] if len(sys.argv) > 1 else "docs/list-vlastnictvi-mock.pdf"

    # Create PDF
    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4

    # Try to use a monospace font for better formatting
    try:
        c.setFont("Courier", 9)
    except:
        c.setFont("Helvetica", 9)

    # Write content
    y_position = height - 2*cm
    for line in content.strip().split('\n'):
        if y_position < 2*cm:
            c.showPage()
            y_position = height - 2*cm
            c.setFont("Courier", 9)

        c.drawString(1.5*cm, y_position, line)
        y_position -= 0.5*cm

    c.save()
    print(f"PDF file created: {output_path}")

except ImportError:
    print("reportlab not installed, creating text file instead...")
    # Fallback to text file
    output_path = sys.argv[1] if len(sys.argv) > 1 else "docs/list-vlastnictvi-mock.txt"

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content.strip())

    print(f"Text file created: {output_path}")
    print("Install reportlab to create PDF: pip3 install reportlab")
