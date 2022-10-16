export class Entity<T = string> {
	private _id: T;

	constructor(id: T) {
		this._id = id;
	}

	get id(): T {
		return this._id;
	}
}
