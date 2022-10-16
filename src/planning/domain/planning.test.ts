import { randomUUID } from "crypto"
import { Planning } from "./planning"

describe("Domain > Planning", function() {
	test("should instantiate properly", function () {
		const planning = new Planning({
			reference: "Alimentação",
			category_filters: [
				randomUUID(),
				randomUUID(),
			],
			limit: 160000
		})

		expect(planning.id).not.toBeUndefined()
		expect(planning.reference).toBe("Alimentação")
		expect(planning.category_filters).toHaveLength(2)
		expect(planning.limit).toBe(160000)
		expect(planning.readable_limit).toBe("R$ 1.600,00")
	})

	test("should fail in invalid planning model", function() {
		const testCases: {[k:string]: Planning.Model} = {
			shouldHaveReference: { reference: null, category_filters: [randomUUID()], limit: 1 },
			shouldHaveLimit: { reference: "ref", category_filters: [randomUUID()], limit: 0 },
			startShouldBeValid: { reference: "ref", category_filters: [randomUUID()], limit: 1, start_at: 1e16 },
			shouldHaveCategories: { reference: "ref", category_filters: [], limit: 1 },
		}

		const shouldHaveReference = () => new Planning({ ...testCases.shouldHaveReference })
		const shouldHaveLimit = () => new Planning({ ...testCases.shouldHaveLimit })
		const startShouldBeValid = () => new Planning({ ...testCases.startShouldBeValid })
		const shouldHaveCategories = () => new Planning({ ...testCases.shouldHaveCategories })

		expect(shouldHaveReference).toThrowError("A planning should have a reference")
		expect(shouldHaveLimit).toThrowError("A planning should have a budget limit")
		expect(startShouldBeValid).toThrowError("The start date from planning should be between 1 - 31")
		expect(shouldHaveCategories).toThrowError("The planning should have at least one category as filter")
	})
})
