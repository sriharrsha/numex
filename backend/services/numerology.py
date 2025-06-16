"""
Comprehensive Numerology System
Implements Pythagorean, Chaldean, and Kabbalistic numerology systems
"""

import re
from datetime import datetime
from typing import Dict, Any

class NumerologyCalculator:
    """Calculate numerology using different ancient systems"""
    
    # Pythagorean system (1-9)
    PYTHAGOREAN = {
        'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
        'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
        'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
    }
    
    # Chaldean system (1-8, no 9)
    CHALDEAN = {
        'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 8, 'G': 3, 'H': 5, 'I': 1,
        'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 7, 'P': 8, 'Q': 1, 'R': 2,
        'S': 3, 'T': 4, 'U': 6, 'V': 6, 'W': 6, 'X': 5, 'Y': 1, 'Z': 7
    }
    
    # Kabbalistic system (Hebrew-based, more complex)
    KABBALISTIC = {
        'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
        'J': 10, 'K': 11, 'L': 12, 'M': 13, 'N': 14, 'O': 15, 'P': 16, 'Q': 17, 'R': 18,
        'S': 19, 'T': 20, 'U': 21, 'V': 22, 'W': 23, 'X': 24, 'Y': 25, 'Z': 26
    }
    
    # Master numbers that shouldn't be reduced
    MASTER_NUMBERS = {11, 22, 33, 44, 55, 66, 77, 88, 99}
    
    # Numerology meanings
    MEANINGS = {
        1: "Leadership, independence, pioneering spirit",
        2: "Cooperation, partnerships, diplomacy",
        3: "Creativity, communication, artistic expression",
        4: "Stability, hard work, practical foundation",
        5: "Freedom, adventure, dynamic change",
        6: "Nurturing, responsibility, home and family",
        7: "Spirituality, introspection, mystical wisdom",
        8: "Material success, authority, business acumen",
        9: "Universal love, humanitarian service, completion",
        11: "Intuition, inspiration, spiritual messenger",
        22: "Master builder, large-scale achievement",
        33: "Master teacher, spiritual uplifment of humanity"
    }

    @staticmethod
    def clean_name(name: str) -> str:
        """Remove non-alphabetic characters and convert to uppercase"""
        return re.sub(r'[^A-Za-z]', '', name).upper()

    @staticmethod
    def reduce_to_single_digit(number: int, allow_master: bool = True) -> int:
        """Reduce number to single digit, preserving master numbers if specified"""
        if allow_master and number in NumerologyCalculator.MASTER_NUMBERS:
            return number
        
        while number > 9:
            number = sum(int(digit) for digit in str(number))
            if allow_master and number in NumerologyCalculator.MASTER_NUMBERS:
                break
        return number

    def calculate_pythagorean(self, name: str) -> Dict[str, Any]:
        """Calculate Pythagorean numerology"""
        clean_name = self.clean_name(name)
        total = sum(self.PYTHAGOREAN.get(char, 0) for char in clean_name)
        destiny = self.reduce_to_single_digit(total)
        
        # Calculate harmony score based on letter distribution and flow
        harmony_score = self._calculate_harmony_score(clean_name, self.PYTHAGOREAN)
        
        return {
            'expression': total,
            'destiny': destiny,
            'meaning': self.MEANINGS.get(destiny, "Unique energy pattern"),
            'harmonyScore': round(harmony_score, 1)
        }

    def calculate_chaldean(self, name: str) -> Dict[str, Any]:
        """Calculate Chaldean numerology"""
        clean_name = self.clean_name(name)
        total = sum(self.CHALDEAN.get(char, 0) for char in clean_name)
        destiny = self.reduce_to_single_digit(total)
        
        harmony_score = self._calculate_harmony_score(clean_name, self.CHALDEAN)
        
        return {
            'expression': total,
            'destiny': destiny,
            'meaning': self.MEANINGS.get(destiny, "Unique energy pattern"),
            'harmonyScore': round(harmony_score, 1)
        }

    def calculate_kabbalistic(self, name: str) -> Dict[str, Any]:
        """Calculate Kabbalistic numerology"""
        clean_name = self.clean_name(name)
        total = sum(self.KABBALISTIC.get(char, 0) for char in clean_name)
        destiny = self.reduce_to_single_digit(total)
        
        harmony_score = self._calculate_harmony_score(clean_name, self.KABBALISTIC, kabbalistic=True)
        
        return {
            'expression': total,
            'destiny': destiny,
            'meaning': self.MEANINGS.get(destiny, "Unique energy pattern"),
            'harmonyScore': round(harmony_score, 1)
        }

    def _calculate_harmony_score(self, name: str, system: Dict, kabbalistic: bool = False) -> float:
        """Calculate harmony score based on letter flow and energy balance"""
        if not name:
            return 0.0
        
        values = [system.get(char, 0) for char in name]
        
        # Base score from average
        avg_value = sum(values) / len(values)
        base_score = min(avg_value / (26 if kabbalistic else 9), 1.0) * 5
        
        # Bonus for balance (variety in numbers)
        unique_values = len(set(values))
        balance_bonus = min(unique_values / len(name), 0.5) * 2
        
        # Bonus for flow (smooth transitions between numbers)
        flow_score = 0
        if len(values) > 1:
            transitions = [abs(values[i] - values[i-1]) for i in range(1, len(values))]
            avg_transition = sum(transitions) / len(transitions)
            max_possible = 25 if kabbalistic else 8
            flow_score = max(0, (max_possible - avg_transition) / max_possible) * 3
        
        total_score = base_score + balance_bonus + flow_score
        return min(total_score, 10.0)

    def calculate_founder_numerology(self, name: str, birthdate: str) -> Dict[str, Any]:
        """Calculate founder's personal numerology including life path"""
        try:
            birth_date = datetime.strptime(birthdate, '%Y-%m-%d')
            life_path = self._calculate_life_path(birth_date)
            
            return {
                'pythagorean': {
                    **self.calculate_pythagorean(name),
                    'lifePathNumber': life_path
                },
                'chaldean': {
                    **self.calculate_chaldean(name),
                    'lifePathNumber': self.reduce_to_single_digit(life_path)
                },
                'kabbalistic': {
                    **self.calculate_kabbalistic(name),
                    'lifePathNumber': life_path
                }
            }
        except ValueError:
            # Return default if birthdate is invalid
            return {
                'pythagorean': self.calculate_pythagorean(name),
                'chaldean': self.calculate_chaldean(name),
                'kabbalistic': self.calculate_kabbalistic(name)
            }

    def _calculate_life_path(self, birth_date: datetime) -> int:
        """Calculate life path number from birth date"""
        day = birth_date.day
        month = birth_date.month
        year = birth_date.year
        
        # Reduce each component
        day_reduced = self.reduce_to_single_digit(day)
        month_reduced = self.reduce_to_single_digit(month)
        year_reduced = self.reduce_to_single_digit(year)
        
        # Sum and reduce final result
        total = day_reduced + month_reduced + year_reduced
        return self.reduce_to_single_digit(total)

    def calculate_name_compatibility(self, business_name: str, founder_name: str, birthdate: str) -> int:
        """Calculate compatibility between business name and founder"""
        business_num = self.calculate_pythagorean(business_name)
        founder_num = self.calculate_founder_numerology(founder_name, birthdate)
        
        # Compare destiny numbers
        business_destiny = business_num['destiny']
        founder_destiny = founder_num['pythagorean']['destiny']
        
        # Calculate compatibility (simplified algorithm)
        difference = abs(business_destiny - founder_destiny)
        
        if difference == 0:
            compatibility = 100
        elif difference <= 2:
            compatibility = 90 - (difference * 5)
        elif difference <= 4:
            compatibility = 80 - (difference * 3)
        else:
            compatibility = 70 - (difference * 2)
        
        # Boost compatibility for complementary numbers
        complementary_pairs = [(1, 8), (2, 7), (3, 6), (4, 5)]
        for pair in complementary_pairs:
            if (business_destiny, founder_destiny) in [pair, pair[::-1]]:
                compatibility += 10
        
        return min(compatibility, 100)

    def calculate_optimal_dates(self, business_name: str, founder_birthdate: str) -> list:
        """Calculate optimal incorporation dates based on numerology"""
        business_num = self.calculate_pythagorean(business_name)['destiny']
        
        try:
            founder_birth = datetime.strptime(founder_birthdate, '%Y-%m-%d')
            founder_life_path = self._calculate_life_path(founder_birth)
        except:
            founder_life_path = 1
        
        optimal_dates = []
        current_date = datetime.now()
        
        # Look for dates in next 90 days that align well
        for days_ahead in range(30, 91):
            check_date = datetime(current_date.year, current_date.month, current_date.day) + timedelta(days=days_ahead)
            date_numerology = self._calculate_life_path(check_date)
            
            # Calculate compatibility with business and founder
            business_compat = 100 - abs(business_num - date_numerology) * 10
            founder_compat = 100 - abs(founder_life_path - date_numerology) * 10
            overall_compat = (business_compat + founder_compat) / 2
            
            if overall_compat >= 85:  # Only include high-compatibility dates
                energy_types = {
                    1: "Leadership & New Beginnings",
                    2: "Partnership & Cooperation", 
                    3: "Creative Expression",
                    4: "Foundation & Stability",
                    5: "Change & Freedom",
                    6: "Service & Responsibility", 
                    7: "Spiritual Growth",
                    8: "Material Success",
                    9: "Completion & Wisdom"
                }
                
                planetary_influences = {
                    1: "Sun - Leadership & Vitality",
                    2: "Moon - Intuition & Partnerships",
                    3: "Jupiter - Expansion & Creativity",
                    4: "Saturn - Structure & Discipline", 
                    5: "Mercury - Communication & Change",
                    6: "Venus - Love & Harmony",
                    7: "Neptune - Spirituality & Dreams",
                    8: "Mars - Action & Material Success",
                    9: "Pluto - Transformation & Rebirth"
                }
                
                optimal_dates.append({
                    'date': check_date.strftime('%Y-%m-%d'),
                    'numerologyValue': date_numerology,
                    'compatibility': int(overall_compat),
                    'energyType': energy_types.get(date_numerology, "Unique Energy"),
                    'description': f"Excellent alignment between business energy ({business_num}), founder path ({founder_life_path}), and date energy ({date_numerology})",
                    'dayOfWeek': check_date.strftime('%A'),
                    'planetaryInfluence': planetary_influences.get(date_numerology, "Universal Energy")
                })
        
        # Sort by compatibility and return top 3
        optimal_dates.sort(key=lambda x: x['compatibility'], reverse=True)
        return optimal_dates[:3]

# Import timedelta for date calculations
from datetime import timedelta