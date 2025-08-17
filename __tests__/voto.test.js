/**
 * @jest-environment jsdom
 */

describe('Vote submission logic', () => {
  let votos, choice, result, mockLocalStorage;

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    });

    // Mock DOM element
    result = {
      textContent: ''
    };

    // Initialize votos object
    votos = {
      Revisão: 5,
      Testes: 3,
      Docs: 2
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when choice is provided', () => {
    it('should increment existing vote count and update localStorage', () => {
      choice = 'Revisão';

      // Execute the code
      if (choice) {
        votos[choice] = (votos[choice] || 0) + 1;
        localStorage.setItem("votos", JSON.stringify(votos));
        result.textContent = `Você votou em: ${choice}`;
      } else {
        result.textContent = "Por favor, selecione uma opção.";
      }

      expect(votos['Revisão']).toBe(6);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "votos", 
        JSON.stringify({ Revisão: 6, Testes: 3, Docs: 2 })
      );
      expect(result.textContent).toBe('Você votou em: Revisão');
    });

    it('should initialize vote count to 1 for new option', () => {
      choice = 'NovaOpção';

      if (choice) {
        votos[choice] = (votos[choice] || 0) + 1;
        localStorage.setItem("votos", JSON.stringify(votos));
        result.textContent = `Você votou em: ${choice}`;
      } else {
        result.textContent = "Por favor, selecione uma opção.";
      }

      expect(votos['NovaOpção']).toBe(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "votos", 
        JSON.stringify({ Revisão: 5, Testes: 3, Docs: 2, NovaOpção: 1 })
      );
      expect(result.textContent).toBe('Você votou em: NovaOpção');
    });

    it('should handle choice with zero initial value', () => {
      votos['Docs'] = 0;
      choice = 'Docs';

      if (choice) {
        votos[choice] = (votos[choice] || 0) + 1;
        localStorage.setItem("votos", JSON.stringify(votos));
        result.textContent = `Você votou em: ${choice}`;
      } else {
        result.textContent = "Por favor, selecione uma opção.";
      }

      expect(votos['Docs']).toBe(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "votos", 
        JSON.stringify({ Revisão: 5, Testes: 3, Docs: 1 })
      );
      expect(result.textContent).toBe('Você votou em: Docs');
    });
  });

  describe('when choice is not provided', () => {
    it('should display error message when choice is empty string', () => {
      choice = '';

      if (choice) {
        votos[choice] = (votos[choice] || 0) + 1;
        localStorage.setItem("votos", JSON.stringify(votos));
        result.textContent = `Você votou em: ${choice}`;
      } else {
        result.textContent = "Por favor, selecione uma opção.";
      }

      expect(result.textContent).toBe('Por favor, selecione uma opção.');
      expect(localStorage.setItem).not.toHaveBeenCalled();
      expect(votos).toEqual({ Revisão: 5, Testes: 3, Docs: 2 }); // unchanged
    });

    it('should display error message when choice is null', () => {
      choice = null;

      if (choice) {
        votos[choice] = (votos[choice] || 0) + 1;
        localStorage.setItem("votos", JSON.stringify(votos));
        result.textContent = `Você votou em: ${choice}`;
      } else {
        result.textContent = "Por favor, selecione uma opção.";
      }

      expect(result.textContent).toBe('Por favor, selecione uma opção.');
      expect(localStorage.setItem).not.toHaveBeenCalled();
      expect(votos).toEqual({ Revisão: 5, Testes: 3, Docs: 2 }); // unchanged
    });

    it('should display error message when choice is undefined', () => {
      choice = undefined;

      if (choice) {
        votos[choice] = (votos[choice] || 0) + 1;
        localStorage.setItem("votos", JSON.stringify(votos));
        result.textContent = `Você votou em: ${choice}`;
      } else {
        result.textContent = "Por favor, selecione uma opção.";
      }

      expect(result.textContent).toBe('Por favor, selecione uma opção.');
      expect(localStorage.setItem).not.toHaveBeenCalled();
      expect(votos).toEqual({ Revisão: 5, Testes: 3, Docs: 2 }); // unchanged
    });
  });
});