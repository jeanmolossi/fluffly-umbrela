import { randomUUID } from "crypto"
import { Transaction, Transactions } from "./transaction"

describe("Domain > Transaction", function () {
	test("should instantiate a transaction properly", function () {
		const category_id_mock = randomUUID()
		const wallet_id_mock = randomUUID()

		const transaction = new Transaction({
			reference: "Uber",
			category_id: category_id_mock,
			wallet_id: wallet_id_mock,
		})

		expect(transaction.id).not.toBeUndefined()
		expect(transaction.reference).toBe("Uber")
		expect(transaction.category_id).toBe(category_id_mock)
		expect(transaction.wallet_id).toBe(wallet_id_mock)
		expect(transaction.type).toBe(Transactions.Type.EXPENSE)
	})

	test("should fails trying instance invalid transaction", function () {
		const testCase: { [k: string]: Transactions.Model } = {
			shouldHaveReference: { reference: null, category_id: randomUUID(), wallet_id: randomUUID() },
			shouldHaveCategory: { reference: "ref", category_id: null, wallet_id: randomUUID() },
			shouldHaveWallet: { reference: "ref", category_id: randomUUID(), wallet_id: null },
		}

		const shouldHaveReference = () => new Transaction({ ...testCase.shouldHaveReference })
		const shouldHaveCategory = () => new Transaction({ ...testCase.shouldHaveCategory })
		const shouldHaveWallet = () => new Transaction({ ...testCase.shouldHaveWallet })

		expect(shouldHaveReference).toThrowError("All transactions should have a reference")
		expect(shouldHaveCategory).toThrowError("You should provide a transaction category")
		expect(shouldHaveWallet).toThrowError("You should provide a wallet from transaction")
	})
})
