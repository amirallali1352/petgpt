"""Static frontend contract checks for species-aware clinical workflows."""

from __future__ import annotations

import re
import subprocess
import unittest
from pathlib import Path


APP = Path(__file__).with_name("app.js")
SOURCE = APP.read_text(encoding="utf-8")


class SpeciesAwareFrontendContractTests(unittest.TestCase):
    def test_disease_catalog_declares_species_scope(self) -> None:
        self.assertIn('species: ["dog", "cat"]', SOURCE)
        self.assertIn('species: ["dog"]', SOURCE)
        self.assertIn('species: ["cat"]', SOURCE)
        self.assertRegex(
            SOURCE,
            r"const visibleDiseases = diseasesCatalog\.filter\(disease => .*includes\(species\)\)",
        )

    def test_nutrition_normal_range_uses_selected_species(self) -> None:
        self.assertIn("const normal = test[`normal_${species}`]", SOURCE)
        self.assertIn("normal-species", SOURCE)
        self.assertIn("speciesKey(this.currentPet?.species)", SOURCE)

    def test_lab_answer_form_is_species_bound(self) -> None:
        self.assertIn('select name="answerTest"', SOURCE)
        self.assertIn('input name="answerSpecies" value="${speciesLabel}" readonly', SOURCE)
        self.assertIn('input name="reference" readonly', SOURCE)
        self.assertIn("const range = test?.[species]", SOURCE)
        self.assertIn("const refreshAnswerMeta", SOURCE)
        self.assertIn("testKey: test.testKey", SOURCE)

    def test_lab_catalog_has_species_ranges(self) -> None:
        self.assertRegex(SOURCE, r"dog:\s*\[[^\]]+\]")
        self.assertRegex(SOURCE, r"cat:\s*\[[^\]]+\]")

    def test_javascript_syntax(self) -> None:
        completed = subprocess.run(
            ["node", "--check", str(APP)],
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(completed.returncode, 0, completed.stderr)


if __name__ == "__main__":
    unittest.main()
