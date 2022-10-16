import { CashMethod, CreditCard, DebitCard, Payment } from "./payment-method"

describe("Domain > Payment Method", function() {
	describe("CashMethod", function() {
		test("should instantiate with correct model", function() {
			const cash = new CashMethod({ name: "Dinheiro" })

			expect(cash.id).not.toBeUndefined()
			expect(cash.type).toBe(Payment.Type.CASH)
			expect(cash.limit).toBeNull()
			expect(cash.readable_limit).toBeNull()
			expect(cash.brand).toBeNull()
		})
	})

	describe("CreditCard", function() {
		test("should instantiate with correct model", function() {
			const expectLimit = 1134001
			const expectBrand = Payment.Brand.ELO

			const cash = new CreditCard({
				name: "Bradesco Grafite",
				limit: expectLimit,
				brand: expectBrand
			})

			expect(cash.id).not.toBeUndefined()
			expect(cash.type).toBe(Payment.Type.CREDIT)
			expect(cash.limit).toBe(expectLimit)
			expect(cash.readable_limit).toBe('R$ 11.340,01')
			expect(cash.brand).toBe(expectBrand)
		})

		test("should fail when give invalid props", function() {
			// it will throw the same error if limit is 0 (zero)
			const shouldHaveLimit = () => new CreditCard({ name: "Empty limit err" })
			const shouldHaveBrand = () => new CreditCard({ name: "Without brand err", limit: 1 })

			expect(shouldHaveLimit).toThrowError("Credit cards should have limit")
			expect(shouldHaveBrand).toThrowError("Credit cards should have a brand")
		})
	})

	describe("DebitCard", function() {
		test("should instantiate with correct model", function() {
			const cash = new DebitCard({
				name: "Bradesco Exclusive",
				limit: 1134001,
				brand: Payment.Brand.ELO
			})

			expect(cash.id).not.toBeUndefined()
			expect(cash.type).toBe(Payment.Type.DEBIT)
			expect(cash.limit).toBeNull()
			expect(cash.readable_limit).toBeNull()
			expect(cash.brand).toBe(Payment.Brand.ELO)
		})

		test("should fail when give invalid props", function() {
			const shouldHaveBrand = () => new DebitCard({ name: "Without brand err" })

			expect(shouldHaveBrand).toThrowError("Debit cards should have a brand")
		})
	})
})
