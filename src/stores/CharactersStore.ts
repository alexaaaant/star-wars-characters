import { Character } from '../types/characters';
import { makeObservable, observable, action, runInAction } from 'mobx';

interface GetCharactersResp {
    results: Character[];
    next: string;
}

interface ReqParams {
    page: number;
    search: string;
}

class CharactersStore {
    characters: Map<string, Character> = new Map();
    reqParams: ReqParams = { page: 1, search: '' };
    completed = false;
    isLoading = false;
    
    constructor() {
        makeObservable(this, {
            characters: observable, 
            completed: observable,
            isLoading: observable,

            getCharacters: action,
            loadNextPage: action,
            startSearch: action,
            updateCharacter: action,
        });
    }

    getCharacters = async () => {
        try {
            if (this.completed) {
                return;
            }
            this.isLoading = true;
            const { page, search } = this.reqParams;
            const response = await fetch(`https://swapi.dev/api/people?page=${page}&search=${search}`);
            const data: GetCharactersResp = await response.json();
            runInAction(() => {
                if (data.results) {
                    data.results.forEach((character) => {
                        this.characters.set(character.name, character);
                    });
                }
                if (!data.next) {
                    this.completed = true;
                }
            });
          } catch (error) {
            console.log('Error loading characters:', error);
            return null;
          } finally {
            runInAction(() => {
                this.isLoading = false;
            });
          }
    }

    startSearch = (request: ReqParams['search']) => {
        if (this.reqParams.search !== request) {
            this.characters.clear();
            this.completed = false;
            this.reqParams.page = 1;
        }
        this.reqParams.search = request;
        this.getCharacters();
    }

    loadNextPage = () => {
        if (!this.completed) {
            this.reqParams.page++;
            this.getCharacters();
        }
    }

    updateCharacter = (name: Character['name'], props: Partial<Character>) => {
        const character = this.characters.get(name)!;
        
        Object.keys(props).forEach((key) => {
            const typedKey = key as keyof  Character;
            character[typedKey] = props[typedKey]!;
        });
    }
}

export const charactersStore = new CharactersStore();
