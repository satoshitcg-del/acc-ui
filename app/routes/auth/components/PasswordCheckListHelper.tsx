interface IStore {
    length?: {
        condition?: number;
        msg?: string;
    };
    match?: {
        msg?: string;
    };
    specialChar?: {
        msg?: string;
    };
    number?: {
        msg?: string;
    };
    uppercase?: {
        msg?: string;
    };
}

interface IRulesStore extends IStore {
    payload?: {
        password?: string;
        passwordConfirm?: string;
    };
}

function RulesStore(this: any, obj: IRulesStore = {}): void {
    this.store = {
        length: {
            valid:
                (obj.payload?.password?.length || 0) >= (obj?.length?.condition || 0),
            msg: obj?.length?.msg || ""
        },
        match: {
            valid:
                (obj.payload?.password || "") === (obj.payload?.passwordConfirm || ""),
            msg: obj?.match?.msg || ""
        },
        specialChar: {
            valid: !!obj?.payload?.password?.match(
                /[!@#$%^&*()_+{}[\];:’<>”.,/\-?]/g
            ),
            msg: obj?.specialChar?.msg || ""
        },
        number: {
            valid: !!obj?.payload?.password?.match(/\d/g),
            msg: obj?.number?.msg || ""
        },
        uppercase: {
            valid: !!obj?.payload?.password?.match(/^(?=.*[a-z])(?=.*[A-Z]).+$/),
            msg: obj?.uppercase?.msg || ""
        }
    };

    this.getActiveRules = () => {
        const result = Object.keys(obj).reduce((acc, key) => {
            const result: { [key: string]: any } = acc;

            if (Object.keys(this.store).includes(key)) {
                result[key] = this.store[key];
            }

            return result;
        }, {});

        return result;
    };
}

export default RulesStore;
